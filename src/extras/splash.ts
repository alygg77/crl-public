import React, {
    createContext,
    Dispatch,
    FC,
    SetStateAction,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react'

const SplashScreenContext = createContext<Dispatch<SetStateAction<number>> | undefined>(
    undefined
)


type WithChildren = {
    children?: ReactNode
}

const LayoutSplashScreen: FC<{visible?: boolean}> = ({visible = true}) => {
    // Everything are ready - remove splashscreen
    const setCount = useContext(SplashScreenContext)

    useEffect(() => {
        if (!visible) {
            return
        }

        if (setCount) {
            setCount((prev) => {
                return prev + 1
            })
        }

        return () => {
            if (setCount) {
                setCount((prev) => {
                    return prev - 1
                })
            }
        }
    }, [setCount, visible])

    return null
}

export {LayoutSplashScreen}
