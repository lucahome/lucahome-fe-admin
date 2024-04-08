import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';


// ----------------------------------------------------------------------

export default function LoginPage(props) {
  const {onLogin} = props;
  return (
    <>
      <Helmet>
        <title> Luca Home </title>
      </Helmet>

      <LoginView onLogin={onLogin} />
    </>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func,
};
