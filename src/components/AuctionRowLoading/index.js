import React from 'react';
import ContentLoader from "react-content-loader"

const AuctionRowLoading = () => {
    return (
        <ContentLoader
            speed={2}
            width={'100%'}
            height={63}
            style={{ marginTop: '5px' }}
            viewBox="0 0 840 63"
            preserveAspectRatio="none"
            backgroundColor="#f3f3f3"
            foregroundColor="#dedede"
        >
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
            <rect x="0" y="0" rx="12" ry="12" width="840" height="60" />
        </ContentLoader>
    );
}

export default AuctionRowLoading;
