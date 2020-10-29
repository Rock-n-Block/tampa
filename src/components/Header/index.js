import React from 'react';
import { NavLink } from 'react-router-dom';
import { intervalToDuration } from 'date-fns'
import { Switch } from 'antd';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { themeActions } from '../../redux/actions';

import './Header.scss'

import logoImg from '../../assets/img/logo.svg';

const Header = () => {
    const dispatch = useDispatch()

    const [timeUntil, setTimeUntil] = React.useState('00:00:00')
    const [isHeaderActive, setIsHeaderActive] = React.useState(false)

    const isDarkTheme = useSelector(({ theme }) => theme.isDarkTheme)


    const handleThemeChange = (value) => {
        dispatch(themeActions.toggleTheme(!value))
    }

    const timeCounter = (date) => {
        const dateObj = intervalToDuration({
            start: new Date(),
            end: date
        })
        setTimeUntil(`${dateObj.days * 24 + dateObj.hours < 10 ? '0' + (dateObj.days * 24 + dateObj.hours) : dateObj.days * 24 + dateObj.hours}:${dateObj.minutes < 10 ? '0' + dateObj.minutes : dateObj.minutes}:${dateObj.seconds < 10 ? '0' + dateObj.seconds : dateObj.seconds}`)
    }

    React.useEffect(() => {
        setInterval(() => {
            timeCounter(1604799025961)
        }, 1000)
    }, [])

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
                        <NavLink to="/"><img src={logoImg} alt="" /></NavLink>
                        <div className="header__nav">
                            <NavLink exact className="header__nav-item" to="/" activeClassName="header__nav-item--active">Stake</NavLink>
                            <NavLink className="header__nav-item" to="/auction" activeClassName="header__nav-item--active">Auction</NavLink>
                            <NavLink className="header__nav-item" to="/lottery" activeClassName="header__nav-item--active">lottery</NavLink>
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header__time">
                            Day ends in: <span>{timeUntil}</span>
                        </div>
                        <div className={classNames('header__theme', {
                            active: !isDarkTheme
                        })}>
                            <span>night</span>
                            <Switch defaultChecked size="big" onChange={handleThemeChange} />
                            <span>Light</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
