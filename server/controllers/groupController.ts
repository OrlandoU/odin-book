//@ts-check
import { body, validationResult, ValidationError, Result } from 'express-validator'
import { Response, NextFunction, Request, Middleware } from 'express'
import Group, { GroupInterface } from '../models/group'
import User, { UserInterface } from '../models/user'
import Post, { PostInterface } from '../models/post'
import { StorageReference, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import fs from 'fs'


export const group_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { sort, limit, ...filter } = req.query
        const limitNumber: number = limit ? +limit : 0

        const groups: GroupInterface[] = await Group.find(filter).sort({ last_active: -1 }).limit(limitNumber)

        return res.json(groups)
    } catch (error) {
        next(error)
    }
}

export const group_last_active_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const posts: PostInterface[] = await Post.find({ isInTrash: false, group: req.params.groupId }).sort({ _id: -1 }).limit(1)
        return res.json(posts[0].create_date)
    } catch (error) {
        next(error)
    }
}

export const query_group: Middleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query
        const groups: GroupInterface[] = await Group.aggregate([
            {
                $search: {
                    index: "groups",
                    autocomplete: {
                        query: query,
                        path: "name",
                        fuzzy: {
                            maxEdits: 1
                        }
                    }
                }
            }, {
                $sort: {
                    last_active: -1
                }
            }
        ]).exec()

        return res.json(groups)
    } catch (error) {
        next(error)
    }
}

export const group_member_count_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const count: number = await User.countDocuments({ groups: req.params.groupId })
        return res.json({ count })
    } catch (error) {
        next(error)
    }
}

export const group_members_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const members: UserInterface[] = await User.find({ groups: req.params.groupId })
        return res.json(members)
    } catch (error) {
        next(error)
    }
}

export const group_details_get: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const group: GroupInterface | null = await Group.findById(req.params.groupId).populate('creator', '-password')
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

export const group_post: Middleware[] = [
    body('name')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing group name'),
    body('privacy')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing privacy mode'),
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const errors: Result<ValidationError> = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        }
        try {
            const group: GroupInterface = new Group({
                creator: req.user!._id,
                name: req.body.name,
                privacy: req.body.privacy
            })

            const result: GroupInterface = await group.save()
            const post: PostInterface = new Post({
                group: result._id,
                user_id: req.user!._id,
                type: 'group-create',
                scope: req.body.privacy == 'public' ? 'public' : 'group'
            })
            await post.save()
            await User.findByIdAndUpdate(req.user!._id, { $push: { groups: result._id } })
            return res.json(result)
        } catch (error) {
            return next(error)
        }

    }
]

export const group_put: Middleware[] = [
    body('name')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Missing group name'),
    body('cover')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const errors: Result<ValidationError> = validationResult(req)
        const group: GroupInterface | null = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(404).send('Group not found');
        }
        if (!errors.isEmpty()) {
            return res.status(400).send(errors.array)
        } else if (!req.user!._id.equals(group.creator)) {
            return res.sendStatus(403)
        }

        try {
            const post: PostInterface = new Post({
                
                content: req.body.content,
                user_id: req.user!._id,
                type: 'group-cover',
                
            })

            const imageRef: StorageReference = ref(req.storage!, `group-covers/${req.user!._id}/${post._id}/${req.file?.filename}`)
            const fileBuffer = fs.readFileSync(req.file!.path);
            await uploadBytes(imageRef, fileBuffer)
            const mediaUrl = await getDownloadURL(imageRef)

            const updatedGroup: GroupInterface | null = await Group.findByIdAndUpdate(req.params.groupId, {
                cover: req.file ? mediaUrl : null,
                name: req.body.name,
            }, { new: true })

            post.group = updatedGroup && updatedGroup._id,
            post.scope = updatedGroup && updatedGroup.privacy == 'public' ? 'public' : 'group'

            
            await post.save()

            return res.json(updatedGroup)
        } catch (error) {
            return next(error)
        }

    }
]

export const group_delete: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        //Delete posts under group
        await Group.deleteMany({ group: req.params.groupId })
        const group: GroupInterface | null = await Group.findByIdAndRemove(req.params.groupId)
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

export const group_join: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, banned: { $nin: [req.user!._id] } })
        if (!group) {
            return res.status(404).send('Group not found')
        }

        await User.findByIdAndUpdate(req.user!._id, { $addToSet: { groups: req.params.groupId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

export const group_leave: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const group: GroupInterface | null = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(404).send('Group not found')
        }

        await User.findByIdAndUpdate(req.user!._id, { $pull: { groups: req.params.groupId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}

export const group_ban: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const group: GroupInterface | null = await Group.findById(req.params.groupId)
        if (!group) {
            return res.status(404).send('Group not found')
        }

        if (!req.user!._id.equals(group.creator)) {
            return res.sendStatus(403)
        }

        await User.findByIdAndUpdate(req.params.userId, { $pop: { groups: req.params.groupId } })
        await Group.findByIdAndUpdate(req.params.groupId, { $push: { banned: req.params.userId } })
        return res.json(group)
    } catch (error) {
        next(error)
    }
}
