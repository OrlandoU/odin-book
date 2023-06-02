import { FirebaseStorage } from "firebase/storage";
import { UserInterface } from "../models/user";

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserInterface,
        storage?: FirebaseStorage
    }
}

declare module 'express' {
    type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<Response | void> | void
}
