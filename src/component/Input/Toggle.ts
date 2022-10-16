import {View} from "../../base/element/ReactUIElement";
import {RUIProp} from "../../base/element/Helpers";
import {Div} from "../../base/utils/HTMLTags";
import ZStack from "../Container/ZStack";
import AnimatedDiv from "../Other/Spring";
import {useSpring} from "@react-spring/web";
import {useRUIState} from "../../base";
import {RUIColor} from "../../base/theme/Colors";
import {DotProp} from "../../base/element/Decorator";


const themes = {
    primary: {
        bg: RUIColor.white.dark,
        toggle: RUIColor.red.standard,
        fg: RUIColor.red.light,
    },
    secondary: {
        bg: RUIColor.white.dark,
        toggle: RUIColor.green.standard,
        fg: RUIColor.green.light,
    },
    tertiary: {
        bg: RUIColor.white.dark,
        toggle: RUIColor.blue.standard,
        fg: RUIColor.blue.light,
    },
}

class Toggle extends View {
    defaultTheme = themes.secondary

    Body = ({defaultValue}: any): any => {
        const valueState = useRUIState(defaultValue)

        const toggleWidth = this.C.width ?? "40px"
        const toggleHeight = this.C.height ?? "24px"
        const toggleBackWidth = toggleWidth
        const toggleBackHeight = `calc(${toggleHeight} * 3 / 5)`
        
        const duration = 150
        const buttonStyles = useSpring({
            translateX: valueState.value ?
                `calc((${toggleWidth} - ${toggleHeight}) / 2)` :
                `calc((${toggleHeight} - ${toggleWidth}) / 2)`,
            config: { duration },
        })
        const frontStyles = useSpring({
            width: valueState.value ? toggleWidth : toggleHeight,
            config: { duration },
        })

        return (
            ZStack(
                ZStack(
                    Div()
                        .width(toggleBackWidth)
                        .height(toggleBackHeight)
                        .borderRadius(`calc(${toggleBackHeight} / 2)`)
                        .backgroundColor(this.theme.bg),
                    AnimatedDiv()
                        .width("100%")
                        .height(toggleBackHeight)
                        .borderRadius(`calc(${toggleBackHeight} / 2)`)
                        .backgroundColor(valueState.value ? this.theme.fg : this.theme.bg)
                        .style(frontStyles)
                )
                    .alignmentH("leading"),
                AnimatedDiv()
                    .width(toggleHeight)
                    .height(toggleHeight)
                    .borderRadius(`calc(${toggleHeight} / 2)`)
                    .backgroundColor(valueState.value ? this.theme.toggle : this.theme.bg)
                    .style(buttonStyles)
            )
                .width(toggleWidth)
                .height(toggleHeight)
                .cursor("pointer")
                .onClick(() => {
                    !!this.C.onChange && this.C.onChange(!valueState.value)
                    valueState.setValue(pre => !pre)
                })
                .pointerEvents("none", this.C.disable ?? false)
                .opacity("0.5", this.C.disable ?? false)
        )
    }

    @DotProp height: any

    @RUIProp
    width(value: string) {return this}

    @RUIProp
    disable(value: boolean=true) {return this}

    @RUIProp
    onChange(value: any) {return this}
}

export default function(defaultValue=false) {
    return new Toggle({defaultValue})
}