import { AccountBox, ExitToApp, Help, Money, VpnKey } from '@material-ui/icons';
import { CATEGORIES, Category } from 'lib/categories';
import { PanelContext } from 'lib/PanelContext';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  ListItemSecondaryAction,
  ListSubheader,
  ListItemIcon,
  ListItemText,
  createStyles,
  makeStyles,
  ListItem,
  Divider,
  Switch,
  List
} from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    link: {
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper)
    }
  })
);

export function DrawerContent() {
  const { categories, dispatch, user } = React.useContext(PanelContext);
  const phonegap = /source~phonegap/.test(localStorage.r);
  const classes = useStyles({});

  function onToggle(category: Category['name']) {
    const _categories =
      categories.indexOf(category) > -1
        ? categories.filter(c => c != category)
        : categories.concat([category]);
    dispatch({ categories: _categories });
    localStorage.categories = _categories;
  }

  return (
    <div>
      <List>
        <ListSubheader>Categories</ListSubheader>
        {CATEGORIES.map(category => (
          <ListItem key={category.name}>
            <ListItemText primary={category.name} />
            <ListItemSecondaryAction>
              <Switch
                onChange={() => onToggle(category.name)}
                checked={categories.indexOf(category.name) > -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <a href={process.enve.ACCOWNT_WEB_URL} className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </ListItem>
        </a>
        <Link to={phonegap ? '/app' : '/app/credits'} className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Money />
            </ListItemIcon>
            <ListItemText
              primary="Credits"
              secondary={`${user.tier.toUpperCase()} — ${user.credits}`}
            />
          </ListItem>
        </Link>
        <a
          href={`${process.enve.ACCOWNT_API_URL}/login/logout`}
          className={classes.link}
        >
          <ListItem button>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </a>
        <Link to="/app/keys" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <VpnKey />
            </ListItemIcon>
            <ListItemText primary="Keys" />
          </ListItem>
        </Link>
        <Link to="/app/docs/help" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
        </Link>
      </List>
    </div>
  );
}
