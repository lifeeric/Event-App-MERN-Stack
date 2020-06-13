import React from 'react';

import TabLink from './TabLink/TabLink';

import './EventTab.scss';

export default React.memo(function EventTab({onChangeTab}) {

    const switching = (value) => {
        onChangeTab(value);
    }

    return (
        <ul className="events__tab">
            <TabLink onTrigger={switching} title="All Events" permalink="/events" />
            <TabLink onTrigger={switching} title="My Events" permalink="/myevents" />
        </ul>
    )
});
