import React from 'react';
import { Tooltip } from 'antd';

import './RowItemTooltip.scss'

const RowItem = ({ children, tooltipText, parent }) => {
    return (
        <div className="row-tooltip">
            <Tooltip
                placement="bottom"
                title={tooltipText}
                getPopupContainer={() => document.getElementById(parent)}
            >
                {children}
            </Tooltip>
        </div>
    );
}

export default RowItem;
