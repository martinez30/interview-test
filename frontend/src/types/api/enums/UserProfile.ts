export enum UserProfile {
    ADMIN = 1,
}

export function getBadgeColorByUserProfile(value: UserProfile) {
    switch (value) {
        case UserProfile.ADMIN:
            return "dark";
    }
}

export function userProfileOptions() {
    return [
        { id: UserProfile.ADMIN, name: "Administrador" },
    ]
}