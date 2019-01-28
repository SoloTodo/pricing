import React from 'react';
import navigation from "./_nav";
import {AppSidebarNav} from "@coreui/react";
import {connect} from "react-redux";
import {settings} from "../settings";

class SidebarNav extends React.Component {
  render() {
    const items = navigation.items.filter(item =>
      this.props.user.permissions.includes(item.requiredPermission)
    );

    return <AppSidebarNav navConfig={{items}} {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    user: state.apiResourceObjects[settings.ownUserUrl]
  }
}

export default connect(mapStateToProps, null)(SidebarNav);
