import React from 'react';
import { Tooltip } from 'antd';

import './QuestionTooltip.scss'

import questionImg from '../../assets/img/question.svg';
import questionImgDark from '../../assets/img/question-d.svg';

const QuestionTooltip = ({ tooltipText, parent, isDarkTheme }) => {
    return (
        <Tooltip
            placement="bottom"
            title={<span dangerouslySetInnerHTML={{ __html: tooltipText }}></span>}
            className="quest-tooltip"
            getPopupContainer={() => document.getElementById(parent)}
        >
            {isDarkTheme ? <img src={questionImgDark} alt="" /> : <img src={questionImg} alt="" />}

        </Tooltip>
    );
}

export default QuestionTooltip;
