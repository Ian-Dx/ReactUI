import ReactUIBase from "../core/ReactUIBase";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";
import {ReactUITheme} from "../theme/ReactUITheme";
import {createElement, ReactElement} from "react";
import {RUIFragment} from "../utils/ReactUIWrapper";
import {NavigationRoute, NavigationRouteMatchable} from "./NavigationRoute";


export namespace C {
    // ---- encapsulate react-router
    export interface PathRoutes {
        [key: string]: (value?: string) => (ReactUIBase | ReactElement)
    }

    export class NavigationView extends ReactUITheme {
        pathRoutes: PathRoutes

        constructor(pathRoutes: PathRoutes) {
            super(Routes)
            this.pathRoutes = pathRoutes
        }

        beforeAsReactElement() {
            let regexNames = []
            // ---- plain names
            for (let path in this.pathRoutes) {
                if (path.startsWith(":")) {
                    regexNames.push(path)
                } else {
                    const newRoute = new NavigationRoute(
                        this.pathRoutes[path] as (() => (ReactUIBase | ReactElement)), path, this
                    )
                    this.children.push(newRoute)
                }
            }

            // ---- regex matches
            let regexPathRoutes: any = {}
            let withSubPathArr = []
            for (let regexName of regexNames) {
                let newRegexName = regexName.replace(":", "").replace("/*", "")
                withSubPathArr.push(regexName.endsWith("/*"))
                regexPathRoutes[newRegexName] = this.pathRoutes[regexName]
            }

            // ---- if any of the path contains /*, set withSubPath true
            let withSubPath = withSubPathArr.includes(true)
            if (Object.keys(regexPathRoutes).length !== 0) {
                const newRoute = new NavigationRouteMatchable(regexPathRoutes, withSubPath, this)
                this.children.push(newRoute)
            }
        }
    }

}
export function NavigationView(pathRoutes: C.PathRoutes) {
    return new C.NavigationView(pathRoutes)
}

export function NavigateBack() {
    let navigate = useNavigate()
    return () => {navigate(-1)}
}

export function NavigateTo(path: any) {
    let navigate = useNavigate()
    return () => navigate(path)
}
