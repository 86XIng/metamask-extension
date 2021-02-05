import React, { Component, createContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getMessage } from '../helpers/utils/i18n-helper';
import { getCurrentLocale } from '../ducks/metamask/metamask';
import {
  getCurrentLocaleMessages,
  getEnLocaleMessages,
  getLocaleMessages,
} from '../ducks/locale/locale';

export const I18nContext = createContext((key) => `[${key}]`);

export const I18nProvider = ({ children, globalLocale }) => {
  const currentLocale = useSelector(getCurrentLocale);
  const allLocales = useSelector(getLocaleMessages);
  const current = useSelector(getCurrentLocaleMessages);
  const en = useSelector(getEnLocaleMessages);

  const localeKey = globalLocale || currentLocale;

  const t = useMemo(() => {
    return (key, ...args) =>
      (allLocales[localeKey] &&
        getMessage(localeKey, allLocales[localeKey], key, ...args)) ||
      getMessage(localeKey, current, key, ...args) ||
      getMessage(localeKey, en, key, ...args);
  }, [allLocales, localeKey, current, en]);

  return <I18nContext.Provider value={t}>{children}</I18nContext.Provider>;
};

I18nProvider.propTypes = {
  children: PropTypes.node,
  globalLocale: PropTypes.string,
};

I18nProvider.defaultProps = {
  children: undefined,
  globalLocale: undefined,
};

export class LegacyI18nProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: undefined,
  };

  static contextType = I18nContext;

  static childContextTypes = {
    t: PropTypes.func,
  };

  getChildContext() {
    return {
      t: this.context,
    };
  }

  render() {
    return this.props.children;
  }
}
