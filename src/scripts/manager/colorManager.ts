import IFarben from './farben.interface'

export default class ColorManager {
    availableColors: Array<IFarben> = new Array()
    usedColors: Array<IFarben> = new Array()
    userColorAssociation: Map<string, IFarben> = new Map()
    windowAssiged: Map<string, boolean> = new Map()
    private static instance: ColorManager
    private constructor() {
        // do something construct...
        const red: IFarben = { screenableColor: 'red', phaserColor: 0xff0000 }
        const green: IFarben = { screenableColor: 'green', phaserColor: 0x00ff00 }
        const purple: IFarben = { screenableColor: 'purple', phaserColor: 0x9c27b0 }
        const blue: IFarben = { screenableColor: 'blue', phaserColor: 0x2196f3 }
        const lime: IFarben = { screenableColor: 'lime', phaserColor: 0xcddc39 }
        const amber: IFarben = { screenableColor: 'amber', phaserColor: 0xffc107 }

        this.availableColors.push(red)
        this.availableColors.push(green)
        this.availableColors.push(purple)
        this.availableColors.push(blue)
        this.availableColors.push(lime)
    }
    static getInstance() {
        if (!ColorManager.instance) {
            ColorManager.instance = new ColorManager()
            // ... any one time initialization goes here ...
        }
        return ColorManager.instance
    }

    removeAllUser() {
        let connectedUsers = Array.from(this.userColorAssociation.keys())
        connectedUsers.forEach((user) => {
            console.log('remove', user, this.getUserColorPhaser(user))
            this.removeUser(user)
        })
    }

    getUnassignedUser(): string | null {
        let userWithoutWindow: string | null = null
        this.windowAssiged.forEach((value, key) => {
            if (value == false) {
                userWithoutWindow = key
            }
        })
        return userWithoutWindow
    }
    setUserAssigned(userId: string) {
        if (this.windowAssiged.has(userId)) {
            this.windowAssiged.set(userId, true)
        }
    }
    removeUserAssigned(userId: string) {
        if (this.windowAssiged.has(userId)) {
            this.windowAssiged.set(userId, false)
        }
    }
    getAvailableColor(): IFarben | undefined {
        const color = this.availableColors.pop()
        if (color) {
            this.usedColors.push(color)
        }
        return color
    }

    getUserColorPhaser(userID: string): number | undefined {
        if (this.userColorAssociation.get(userID)) {
            return this.userColorAssociation.get(userID)?.phaserColor
        } else {
            return undefined
        }
    }
    addUser(userID): IFarben | null {
        const color = this.getAvailableColor()
        if (color) {
            this.userColorAssociation.set(userID, color)
            this.windowAssiged.set(userID, false)
            return color
        } else {
            return null
        }
    }
    removeUser(userID) {
        //console.log(this.userColorAssociation)
        if (this.userColorAssociation.has(userID)) {
            console.log('deleting')
            this.windowAssiged.delete(userID)
            const color = this.userColorAssociation.get(userID)!
            this.availableColors.push(color)
            //remove color from used colors
            const index = this.usedColors.indexOf(color, 0)
            if (index > -1) {
                this.usedColors.splice(index, 1)
            }
            this.userColorAssociation.delete(userID)
        }
    }
}
