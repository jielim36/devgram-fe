export type VisibilityDurationType = 1 | 3 | 7 | 14 | 30 | 90 | 0;

export type PrivacySetting = {
    id?: number;
    userId: number;
    canSeePostFollower: boolean,
    canSeePostFollowing: boolean,
    canSeePostFriend: boolean,
    canSeePostAll: boolean,
    postVisibilityDurationFollower: VisibilityDurationType,
    postVisibilityDurationFollowing: VisibilityDurationType,
    postVisibilityDurationFriend: VisibilityDurationType,
    postVisibilityDurationAll: VisibilityDurationType,
}