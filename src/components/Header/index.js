import React from 'react';
import { NavLink } from 'react-router-dom';
import { Switch } from 'antd';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { themeActions } from '../../redux/actions';

import './Header.scss'

import logoImg from '../../assets/img/logo.svg';
import logoImgDark from '../../assets/img/logo-d.svg';
import MetamaskImg from '../../assets/img/metamask.svg';

const Header = ({ isDarkTheme, userAddress, contractService }) => {
    const dispatch = useDispatch()

    const [secondInterval, setSecondInterval] = React.useState(null)

    const [timeUntil, setTimeUntil] = React.useState('00:00:00')
    const [isHeaderActive, setIsHeaderActive] = React.useState(false)

    const handleThemeChange = (value) => {
        dispatch(themeActions.toggleTheme(!value))
    }

    const timeCounter = (seconds) => {

        const hours = Math.floor(seconds / 3600)

        const minutes = Math.floor(seconds / 60) - (hours * 60)

        const sec = seconds - (minutes * 60) - (hours * 3600)

        setTimeUntil(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${sec < 10 ? '0' + sec : sec}`)
    }

    const getDate = () => {
        contractService.currentDay()
            .then(day => {
                contractService.getDayUnixTime(day)
                    .then(date => {
                        const interval = setInterval(() => {
                            let lotteryDateStart = moment.utc(date * 1000).add(1, 'days')
                            // let lotteryDateStart = moment.utc(date * 1000).add(10, 'minutes')
                            let dateNow = moment.utc()

                            const seconds = lotteryDateStart.diff(dateNow, 'seconds')

                            if (seconds === 0 || seconds < 0) {
                                clearInterval(secondInterval)
                                clearInterval(interval)
                                setTimeUntil('00:00:00')
                                getDate()
                            }

                            timeCounter(seconds)
                        }, 1000)

                        setSecondInterval(interval)
                    })
            })
    }

    React.useEffect(() => {
        if (contractService) {

            getDate()
        }
    }, [contractService])

    React.useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 10) {
                setIsHeaderActive(true)
            } else {
                setIsHeaderActive(false)
            }
        })
    }, [])


    return (
        <header className={classNames('header', {
            'active': isHeaderActive
        })}>
            <div className="row">
                <div className="header__content">
                    <div className="header__left">
                        <NavLink to="/">
                            {isDarkTheme ? <img src={logoImgDark} alt="" /> : <img src={logoImg} alt="" />}
                        </NavLink>
                        <div className="header__nav m-h">
                            <NavLink exact className="header__nav-item" to="/" activeClassName="header__nav-item--active">Stake</NavLink>
                            <NavLink className="header__nav-item" to="/auction" activeClassName="header__nav-item--active">Auction</NavLink>
                            <NavLink className="header__nav-item" to="/lottery" activeClassName="header__nav-item--active">lottery</NavLink>
                        </div>
                    </div>
                    <div className="header__right m-h">
                        <div className="header__time">
                            auction ends in: <span>{timeUntil}</span>
                        </div>
                        <div className={classNames('header__theme', {
                            active: !isDarkTheme
                        })}>
                            <span>night</span>
                            <Switch defaultChecked={!isDarkTheme} size="big" onChange={handleThemeChange} />
                            <span>Light</span>
                        </div>
                        {userAddress && <div className="header__metamask">
                            <img src={MetamaskImg} alt="" />
                            <span>{userAddress}</span>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
