import { useCallback, useContext, useEffect, useState } from "react";
import NavModal from "../NavModal";
import { updateToViewedNotifications } from "../../../functions/notification";
import { TokenContext } from "../../../contexts/TokenContext";
import useSound from "use-sound";
import new_notification from '../../../assets/sounds/new_notification.mp3'
import Notification from '../Notification'
import { SocketContext } from "../../../contexts/SocketContext";
import { UserContext } from "../../../contexts/UserContext";
import { getNotifications } from "../../../functions/notification";

export default function Notifications() {
    const user = useContext(UserContext)
    const socket = useContext(SocketContext)
    const { token } = useContext(TokenContext)

    const [newNotifications, setNewNotifications] = useState([])
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [notifications, setNotifications] = useState([])

    const [playNotificationAudio] = useSound(new_notification)

    const handleOpenNotifications = () => {
        updateToViewedNotifications(token)
        setNotificationsCount(0)
    }

    const handleSocket = useCallback(()=>{
        const newNotificationHandler = (notification) => {
            console.log(notification)
            let isNew = true

            if (newNotifications.find(el => el._id === notification._id)) {
                isNew = false
            }
            setNewNotifications((prev) => prev.filter((el) => el._id !== notification._id));

            if (notifications.find(el => el._id === notification._id)) {
                isNew = false
            }
            setNotifications((prev) => prev.filter((el) => el._id !== notification._id));
            setNotificationsCount((new Set([...newNotifications.map(noti => noti._id), notification._id])).size)
            setNewNotifications((prev) => [notification, ...prev]);
            if (isNew) {
                playNotificationAudio()
            }
        };

        const removeNotificationHandler = (notification) => {
            setNotificationsCount(prev => prev - 1)

            setNewNotifications((prev) =>
                prev.filter((el) => el._id !== notification._id)
            );
            setNotifications((prev) =>
                prev.filter((el) => el._id !== notification._id)
            );
        };

        return {removeNotificationHandler, newNotificationHandler}
    }, [notifications, newNotifications])

    useEffect(() => {
        if (socket.on) {
            const {newNotificationHandler, removeNotificationHandler} = handleSocket()

            // Register the event listeners
            socket.on('new_notification', newNotificationHandler);
            socket.on('remove_notification', removeNotificationHandler);

            // Clean up the event listeners when the component unmounts or when the dependencies change
            return () => {
                socket.off('new_notification', newNotificationHandler);
                socket.off('remove_notification', removeNotificationHandler);
            };
        }
    }, [socket, handleSocket]);

    useEffect(() => {
        if (user._id) {
            getNotifications(token, { user_id: user._id, isViewed: false })
                .then(value => {
                    setNotificationsCount(value.length)
                    setNewNotifications(value)
                })

            getNotifications(token, { user_id: user._id, isViewed: true })
                .then(value => setNotifications(value))
        }
    }, [token, user._id])

    return (
        <NavModal onVisible={handleOpenNotifications} count={notificationsCount} svg={<svg viewBox="0 0 28 28" alt="" class="x1lliihq x1k90msu x2h7rmj x1qfuztq x198g3q0" fill="currentColor" height="20" width="20"><path d="M7.847 23.488C9.207 23.488 11.443 23.363 14.467 22.806 13.944 24.228 12.581 25.247 10.98 25.247 9.649 25.247 8.483 24.542 7.825 23.488L7.847 23.488ZM24.923 15.73C25.17 17.002 24.278 18.127 22.27 19.076 21.17 19.595 18.724 20.583 14.684 21.369 11.568 21.974 9.285 22.113 7.848 22.113 7.421 22.113 7.068 22.101 6.79 22.085 4.574 21.958 3.324 21.248 3.077 19.976 2.702 18.049 3.295 17.305 4.278 16.073L4.537 15.748C5.2 14.907 5.459 14.081 5.035 11.902 4.086 7.022 6.284 3.687 11.064 2.753 15.846 1.83 19.134 4.096 20.083 8.977 20.506 11.156 21.056 11.824 21.986 12.355L21.986 12.356 22.348 12.561C23.72 13.335 24.548 13.802 24.923 15.73Z"></path></svg>}>
            <h2>Notifications</h2>
            {newNotifications.length > 0 &&
                <div className="notification-section">
                    <div className="sub-title-smaller">New</div>
                    <div className="notifications-container">
                        {newNotifications.map(noti =>
                            <Notification {...noti} key={noti._id} />
                        )}
                    </div>
                </div>}
            {notifications.length > 0 &&
                <div className="notification-section">
                    <div className="sub-title-smaller">Earlier</div>
                    <div className="notifications-container" onClick={() => document.body.click()}>
                        {notifications.map(noti =>
                            <Notification {...noti} key={noti._id} />
                        )}
                    </div>
                </div>}
        </NavModal>
    )
}