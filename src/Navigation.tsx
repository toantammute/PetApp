import { CommonActions } from "@react-navigation/native";

import { NavigationContainerRef, ParamListBase } from "@react-navigation/native";

let navigator: NavigationContainerRef<ParamListBase> | null = null;

function setTopLevelNavigator(navigationRef: any) {
  navigator = navigationRef;
}

function navigate(routeName: string, params: any) {
    if (navigator) {
      navigator.navigate(routeName, params);
    }
}

function goBack() {
    if (navigator?.dispatch) {
      CommonActions.goBack();
    }
}
export default {
    setTopLevelNavigator,
    navigate,
    goBack
}