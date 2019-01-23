import React from 'react';
import navigation from "./_nav";
import {AppSidebarNav} from "@coreui/react";

class SidebarNav extends React.Component {
  render() {
    return <AppSidebarNav navConfig={navigation} {...this.props} />;
  }
}

export default SidebarNav;
