// OHT_REQUESTS — shared in-memory request queue used by every department dashboard.
// MVP: seeded fake data, no backend, resets on page reload.
// Later: swap the DATA array below for a fetch from Airtable's Requests table —
// the rendering code in oht_requests_ui.js only needs an array shaped like this,
// so no page-level UI code has to change.

window.OHT_REQUESTS = (function () {
    const DATA = [
        {
            id: 'REQ-101',
            type: 'TASK REQUEST',
            from: 'OPERATIONS',
            to: 'INVENTORY',
            title: '#25732 Replacement Shipment',
            detail: 'Prep replacement stock for order #25732',
            quantity: null,
            priority: 'HIGH',
            dueDate: 'Aug 30',
            status: 'PENDING',
            createdAt: '2026-08-25'
        },
        {
            id: 'REQ-102',
            type: 'STOCK REQUEST',
            from: 'SHIPPING',
            to: 'INVENTORY',
            title: 'Crystal Ribbon Necklace x20',
            detail: "Needed to fulfill today's orders",
            quantity: 20,
            priority: 'NORMAL',
            dueDate: 'Aug 30',
            status: 'PENDING',
            createdAt: '2026-08-26'
        },
        {
            id: 'REQ-103',
            type: 'PURCHASE ORDER',
            from: 'OPERATIONS',
            to: 'INVENTORY',
            title: 'Black Shipping Bags x500',
            detail: 'Packaging bags below reorder point',
            quantity: 500,
            priority: 'NORMAL',
            dueDate: 'Sep 03',
            status: 'WAITING',
            createdAt: '2026-08-24'
        },
        {
            id: 'REQ-104',
            type: 'TASK REQUEST',
            from: 'MARKETING',
            to: 'CONTENT',
            title: 'Naomi campaign — 3 Reels',
            detail: 'Need 3 reels for the Naomi campaign push',
            quantity: 3,
            priority: 'NORMAL',
            dueDate: 'Sep 05',
            status: 'IN PROGRESS',
            createdAt: '2026-08-20'
        },
        {
            id: 'REQ-105',
            type: 'TASK REQUEST',
            from: 'CONTENT',
            to: 'MARKETING',
            title: 'Naomi product + brief needed',
            detail: 'Need product samples and campaign brief to start the shoot',
            quantity: null,
            priority: 'NORMAL',
            dueDate: 'Aug 29',
            status: 'PENDING',
            createdAt: '2026-08-22'
        },
        {
            id: 'REQ-106',
            type: 'TASK REQUEST',
            from: 'INVENTORY',
            to: 'CONTENT',
            title: 'Return 5 samples after shoot',
            detail: 'Product shoot finished — please return samples',
            quantity: 5,
            priority: 'LOW',
            dueDate: 'Sep 01',
            status: 'COMPLETED',
            createdAt: '2026-08-18'
        },
        {
            id: 'REQ-107',
            type: 'STOCK REQUEST',
            from: 'KOREA OPS',
            to: 'CONTENT',
            title: '한국몰 제품 이미지 30개',
            detail: 'Korea storefront needs 30 product images',
            quantity: 30,
            priority: 'NORMAL',
            dueDate: 'Sep 10',
            status: 'PENDING',
            createdAt: '2026-08-27'
        },
        {
            id: 'REQ-108',
            type: 'TASK REQUEST',
            from: 'SHIPPING',
            to: 'OPERATIONS',
            title: 'USPS claim #25455 needs escalation',
            detail: 'Contact carrier / approve resolution',
            quantity: null,
            priority: 'HIGH',
            dueDate: 'Aug 28',
            status: 'PENDING',
            createdAt: '2026-08-21'
        }
    ];

    function normalize(dept) {
        return (dept || '').toUpperCase();
    }

    function all() {
        return DATA;
    }

    function inbox(dept) {
        dept = normalize(dept);
        return DATA.filter(function (r) {
            return r.to === dept && r.status !== 'COMPLETED' && r.status !== 'DECLINED';
        });
    }

    function sent(dept) {
        dept = normalize(dept);
        return DATA.filter(function (r) {
            return r.from === dept && r.status !== 'COMPLETED' && r.status !== 'DECLINED';
        });
    }

    function completed(dept) {
        dept = normalize(dept);
        return DATA.filter(function (r) {
            return (r.to === dept || r.from === dept) && (r.status === 'COMPLETED' || r.status === 'DECLINED');
        });
    }

    function add(record) {
        DATA.unshift(record);
    }

    function setStatus(id, status) {
        const r = DATA.find(function (x) { return x.id === id; });
        if (r) r.status = status;
    }

    function nextId() {
        const nums = DATA
            .map(function (r) { return parseInt(r.id.replace('REQ-', ''), 10); })
            .filter(function (n) { return !isNaN(n); });
        const max = nums.length ? Math.max.apply(null, nums) : 100;
        return 'REQ-' + (max + 1);
    }

    return { all: all, inbox: inbox, sent: sent, completed: completed, add: add, setStatus: setStatus, nextId: nextId, DATA: DATA };
})();
