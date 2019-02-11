import React from 'react'
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import Route from 'route-parser';
import {settings} from "../settings";
import routes from "../Layout/routes";

const isFunction = value => typeof value === 'function';

const getPathTokens = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr) => {
    if (curr === '') {
      return prev
    }
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });

  return paths;
};

function getRouteMatch(path) {
  return routes
    .map((route, i) => {
      const params = new Route(route.path).match(path);
      return {
        didMatch: params !== false,
        params,
        key: i
      };
    })
    .filter(item => item.didMatch)[0];
}

class Breadcrumbs extends React.Component{
  getBreadcrumbs(){
    const pathTokens = getPathTokens(this.props.location.pathname);
    return pathTokens.map(path => {
      const routeMatch = getRouteMatch(path);
      if (!routeMatch) {
        return null
      }
      const routeValue = routes[routeMatch.key].name;
      let name = '';
      if (isFunction(routeValue)) {
        const {apiResource, apiResourceObjectId} = routeValue(routeMatch.params);
        const apiResourceObjectUrl = `${settings.apiResourceEndpoints[apiResource]}${apiResourceObjectId}/`;
        const apiResourceObject = this.props.apiResourceObjects[apiResourceObjectUrl];
        if (apiResourceObject) {
          name = apiResourceObject.name || apiResourceObject.id;
        }
      } else {
        name = routeValue
      }
      return { name, path };
    }).filter(x => x !== null);
  }

  render() {
    const breadcrumbs = this.getBreadcrumbs();
    let title = '';
    switch (breadcrumbs.length) {
      case 1:
        title = breadcrumbs[0].name;
        break;
      case 2:
        title = breadcrumbs[1].name;
        break;
      case 3:
        title = `${breadcrumbs[2].name} - ${breadcrumbs[1].name}`;
        break;
      case 4:
        title = `${breadcrumbs[2].name} - ${breadcrumbs[3].name}`;
        break;
      default:
        title = ''
    }

    document.title = `${title} - SoloTodo`;

    return(
      <div>
        <ol className="breadcrumb">
          {breadcrumbs.map(breadcrumb =>
            <li key={breadcrumb.path} className="breadcrumb-item">
              <Link to={breadcrumb.path}>
                {breadcrumb.name}
              </Link>
            </li>
          )}
        </ol>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    apiResourceObjects: state.apiResourceObjects
  }
}

export default connect(mapStateToProps)(Breadcrumbs)