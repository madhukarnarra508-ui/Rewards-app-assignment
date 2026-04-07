import React from 'react'
import PropTypes from 'prop-types'

const ErrorMessage = ({error}) => {
    if(!error?.hasError) return null;
  return <div className='error'>{error.message}</div>
}

ErrorMessage.propTypes = {
    error:PropTypes.object.isRequired
}

export default ErrorMessage