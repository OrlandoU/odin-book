declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.mp3' {
    const content: string;
    export default content;
}

declare module 'react-mentions'{
    export const Mention: ReactNode

    export const MentionsInput: ReactNode
}