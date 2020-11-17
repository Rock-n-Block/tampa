import React from 'react';
import { Tooltip } from 'antd';

const RowItem = ({ children, tooltipText, parent }) => {
    return (
        <Tooltip
            placement="bottom"
            title={tooltipText}
            getPopupContainer={() => document.getElementById(parent)}
        >
            {children}
        </Tooltip>
    );
}

export default RowItem;
