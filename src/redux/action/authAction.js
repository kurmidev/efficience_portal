import { api, extApi } from '../../axios';
import { API_SETTING, USER_AUTH_TOKEN, USER_TOKEN, USER_DETAILS_STORAGE, EXT_TOKEN, EXT_USER } from '../../env.conf';
import { history, isTokenValid } from '../../utilits';
import * as actionType from '../actiontype';

export const authStart = (props) => {
    return {
        type: actionType.AUTH_START
    };
}

export const authSuccess = (token, user) => {
    return {
        type: actionType.AUTH_SUCCESS,
        token: token,
        user: user
    };
}

export const logout = () => {
    localStorage.removeItem(USER_TOKEN);
    localStorage.removeItem(USER_DETAILS_STORAGE);
    localStorage.removeItem(USER_AUTH_TOKEN);
    return {
        type: actionType.AUTH_LOGOUT
    }
}

export const authFail = (error) => {
    let message = "";
    for (const property in error) {
        message = `${message} ${error[property].join(' ')}.`;
    }
    console.log("Error message", error);
    return {
        type: actionType.AUTH_FAIL,
        error: message
    }
}

export const autoLogin = () => {
    return dispatch => {
        const token = isTokenValid(USER_AUTH_TOKEN);
        console.log("Is token valid", token);
        if (token) {
            dispatch(authStart());
            const authData = {
                LoginForm: {
                    token: token
                }
            }
            const headers = { 'authkey': API_SETTING.authkey };
            api.post('/user/login-token', authData, { headers: headers })
                .then(response => {
                    setToken(response, dispatch);
                }).catch(err => {
                    if (err.response) {
                        dispatch(authFail(err.response.data.message));
                    }
                });
        }
    }
}

const setToken = (response, dispatch) => {
    let data = response.data.data;
    let user_data = {
        id: data.subscriber_id,
        name: data.name,
        username: data.username,
        email: data.email,
        mobile_no: data.mobile_no,
        is_customer: true
    };
    console.log("Set token called", user_data, data.access_token, [USER_TOKEN, USER_DETAILS_STORAGE])
    localStorage.setItem(USER_TOKEN, JSON.stringify({ token: data.access_token, time: new Date() }));
    localStorage.setItem(USER_DETAILS_STORAGE, JSON.stringify(user_data));
    localStorage.setItem(USER_AUTH_TOKEN, JSON.stringify({ token: data.auth_token, time: new Date() }));
    dispatch(authSuccess(data.access_token, user_data));
    history.push('/myaccount');
}

export const auth = (username = '', password = '', isUserSignin = false) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            LoginForm: {
                username: username || API_SETTING.username,
                password: password || API_SETTING.password
            }
        }

        if (!isUserSignin) {
            extApi.post('/user/login', authData)
                .then(response => {
                    let data = response.data.data;
                    let user_data = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        is_customer: false
                    };
                    localStorage.setItem(EXT_TOKEN, JSON.stringify({ token: data.access_token, time: new Date() }));
                    localStorage.setItem(EXT_USER, data.name);
                    dispatch(authSuccess(data.access_token, user_data))
                })
                .catch(err => {
                    if (err) {
                        dispatch(authFail(err));
                    }
                })
        } else {
            const headers = { 'authkey': API_SETTING.authkey };
            api.post('/user/login', authData, { headers: headers })
                .then(response => {
                    setToken(response, dispatch);
                })
                .catch(err => {
                    if (err.response) {
                        console.log("Error occured", err.response);
                        dispatch(authFail(err.response.data.data.message));
                    }
                });
        }
    }
}