// OHT_REQUESTS_UI — shared rendering logic for the "Requests" tab.
// Every department page includes this file + oht_requests_data.js, then calls
// OHT_REQUESTS_UI.mount('#requests-root', 'INVENTORY') once access is confirmed.
// Requires each page to already load oht_requests_data.js first, and to have
// the .req-* CSS classes defined (see any department dashboard's <style> block).

window.OHT_REQUESTS_UI = (function () {
    const DEPTS = ['MARKETING', 'CONTENT', 'SHIPPING', 'INVENTORY', 'OPERATIONS', 'KOREA OPS'];

    let activeSubtab = 'inbox';
    let myDept = null;
    let rootSelector = null;

    function mount(selector, dept) {
        rootSelector = selector;
        myDept = (dept || '').toUpperCase();
        render();
    }

    function priorityPill(priority) {
        const cls = priority === 'HIGH' ? 'status-red' : (priority === 'LOW' ? 'status-blue' : 'status-amber');
        return '<span class="status-pill ' + cls + '">' + priority + '</span>';
    }

    function statusPill(status) {
        const map = {
            PENDING: 'status-blue',
            WAITING: 'status-blue',
            ACCEPTED: 'status-purple',
            'IN PROGRESS': 'status-amber',
            COMPLETED: 'status-green',
            DECLINED: 'status-red'
        };
        return '<span class="status-pill ' + (map[status] || 'status-blue') + '">' + status + '</span>';
    }

    function cardHTML(r, mode) {
        let actions = '';
        if (mode === 'inbox') {
            if (r.status === 'PENDING' || r.status === 'WAITING') {
                actions += '<button class="req-btn" onclick="OHT_REQUESTS_UI.accept(\'' + r.id + '\')">Accept</button>';
                if (r.quantity) {
                    actions += '<button class="req-btn req-btn-secondary" onclick="OHT_REQUESTS_UI.partial(\'' + r.id + '\')">Partial</button>';
                }
                actions += '<button class="req-btn req-btn-secondary" onclick="OHT_REQUESTS_UI.decline(\'' + r.id + '\')">Decline</button>';
            } else if (r.status === 'ACCEPTED' || r.status === 'IN PROGRESS') {
                actions += '<button class="req-btn" onclick="OHT_REQUESTS_UI.complete(\'' + r.id + '\')">Mark Complete</button>';
            }
        }

        const fromTo = (mode === 'sent')
            ? ('&rarr; ' + r.to)
            : ('FROM ' + r.from);

        const metaBits = [];
        if (r.quantity) metaBits.push(r.quantity + ' units');
        metaBits.push('Due ' + r.dueDate);

        return '' +
            '<div class="req-card">' +
                '<div class="req-card-top">' + priorityPill(r.priority) + '<span class="req-type">' + r.type + '</span></div>' +
                '<div class="req-from">' + fromTo + '</div>' +
                '<div class="req-title">' + r.title + '</div>' +
                '<div class="req-meta">' + metaBits.join(' · ') + '</div>' +
                '<div class="req-bottom">' + statusPill(r.status) + '<div class="req-actions">' + actions + '</div></div>' +
            '</div>';
    }

    function render() {
        if (!rootSelector) return;
        const root = document.querySelector(rootSelector);
        if (!root) return;

        const inboxList = OHT_REQUESTS.inbox(myDept);
        const sentList = OHT_REQUESTS.sent(myDept);
        const completedList = OHT_REQUESTS.completed(myDept);

        let list, mode;
        if (activeSubtab === 'sent') { list = sentList; mode = 'sent'; }
        else if (activeSubtab === 'completed') { list = completedList; mode = 'completed'; }
        else { list = inboxList; mode = 'inbox'; }

        const cardsHTML = list.length
            ? list.map(function (r) { return cardHTML(r, mode); }).join('')
            : '<p class="muted">Nothing here right now.</p>';

        root.innerHTML = '' +
            '<div class="req-header">' +
                '<button class="req-new-btn" onclick="OHT_REQUESTS_UI.openModal()">+ New Request</button>' +
            '</div>' +
            '<div class="req-subtabs">' +
                '<span class="req-subtab ' + (activeSubtab === 'inbox' ? 'active' : '') + '" onclick="OHT_REQUESTS_UI.setSubtab(\'inbox\')">Inbox <span class="req-count">' + inboxList.length + '</span></span>' +
                '<span class="req-subtab ' + (activeSubtab === 'sent' ? 'active' : '') + '" onclick="OHT_REQUESTS_UI.setSubtab(\'sent\')">Sent <span class="req-count">' + sentList.length + '</span></span>' +
                '<span class="req-subtab ' + (activeSubtab === 'completed' ? 'active' : '') + '" onclick="OHT_REQUESTS_UI.setSubtab(\'completed\')">Completed <span class="req-count">' + completedList.length + '</span></span>' +
            '</div>' +
            '<div class="req-list">' + cardsHTML + '</div>' +
            modalHTML();
    }

    function setSubtab(name) { activeSubtab = name; render(); }
    function accept(id) { OHT_REQUESTS.setStatus(id, 'ACCEPTED'); render(); }
    function decline(id) { OHT_REQUESTS.setStatus(id, 'DECLINED'); render(); }
    function partial(id) { OHT_REQUESTS.setStatus(id, 'IN PROGRESS'); render(); }
    function complete(id) { OHT_REQUESTS.setStatus(id, 'COMPLETED'); render(); }

    function modalHTML() {
        const options = DEPTS.filter(function (d) { return d !== myDept; })
            .map(function (d) { return '<option value="' + d + '">' + d + '</option>'; })
            .join('');

        return '' +
            '<div class="req-modal-overlay" id="req-modal-overlay">' +
                '<div class="req-modal">' +
                    '<div class="req-modal-title">New Request</div>' +
                    '<label class="req-label">To</label>' +
                    '<select id="req-to" class="req-input">' + options + '</select>' +
                    '<label class="req-label">Type</label>' +
                    '<select id="req-type" class="req-input">' +
                        '<option>TASK REQUEST</option><option>STOCK REQUEST</option><option>PURCHASE ORDER</option>' +
                    '</select>' +
                    '<label class="req-label">Request</label>' +
                    '<input id="req-title" class="req-input" type="text" placeholder="What do you need?">' +
                    '<label class="req-label">Quantity (optional)</label>' +
                    '<input id="req-qty" class="req-input" type="number" min="0" placeholder="e.g. 500">' +
                    '<label class="req-label">Priority</label>' +
                    '<select id="req-priority" class="req-input"><option>NORMAL</option><option>HIGH</option><option>LOW</option></select>' +
                    '<label class="req-label">Needed by</label>' +
                    '<input id="req-due" class="req-input" type="text" placeholder="e.g. Sep 03">' +
                    '<div class="req-modal-actions">' +
                        '<button class="req-btn req-btn-secondary" onclick="OHT_REQUESTS_UI.closeModal()">Cancel</button>' +
                        '<button class="req-btn" onclick="OHT_REQUESTS_UI.submitModal()">Send Request &rarr;</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function openModal() {
        const el = document.getElementById('req-modal-overlay');
        if (el) el.classList.add('open');
    }

    function closeModal() {
        const el = document.getElementById('req-modal-overlay');
        if (el) el.classList.remove('open');
    }

    function submitModal() {
        const to = document.getElementById('req-to').value;
        const type = document.getElementById('req-type').value;
        const title = document.getElementById('req-title').value.trim();
        const qty = document.getElementById('req-qty').value;
        const priority = document.getElementById('req-priority').value;
        const due = document.getElementById('req-due').value.trim() || 'TBD';

        if (!title) {
            alert('Please describe the request.');
            return;
        }

        OHT_REQUESTS.add({
            id: OHT_REQUESTS.nextId(),
            type: type,
            from: myDept,
            to: to,
            title: title,
            detail: '',
            quantity: qty ? parseInt(qty, 10) : null,
            priority: priority,
            dueDate: due,
            status: 'PENDING',
            createdAt: new Date().toISOString().slice(0, 10)
        });

        activeSubtab = 'sent';
        render();
        closeModal();
    }

    // ---- Overview "Needs Your Attention" — derived from the same inbox data ----
    // Keeps Overview from ever drifting out of sync with the Requests tab, since
    // both read the same OHT_REQUESTS.inbox() list instead of separate hardcoded text.
    function overviewAttentionHTML(dept) {
        dept = (dept || '').toUpperCase();
        const rank = { HIGH: 0, NORMAL: 1, LOW: 2 };
        const items = OHT_REQUESTS.inbox(dept)
            .slice()
            .sort(function (a, b) { return (rank[a.priority] || 1) - (rank[b.priority] || 1); })
            .slice(0, 3);

        if (!items.length) {
            return '' +
                '<div class="attn-item">' +
                    '<div class="attn-dot dot-gray"></div>' +
                    '<div class="attn-body">' +
                        '<div class="attn-title">Nothing flagged right now</div>' +
                        '<div class="attn-sub">Incoming requests will show here</div>' +
                    '</div>' +
                    '<div class="attn-tag">—</div>' +
                '</div>';
        }

        return items.map(function (r) {
            const dot = r.priority === 'HIGH' ? 'dot-red' : (r.priority === 'LOW' ? 'dot-gray' : 'dot-amber');
            return '' +
                '<div class="attn-item">' +
                    '<div class="attn-dot ' + dot + '"></div>' +
                    '<div class="attn-body">' +
                        '<div class="attn-title">' + r.title + '</div>' +
                        '<div class="attn-sub">From ' + r.from + ' · Due ' + r.dueDate + '</div>' +
                    '</div>' +
                    '<div class="attn-tag">' + r.type + '</div>' +
                '</div>';
        }).join('');
    }

    function mountOverviewAttention(listSelector, countSelector, dept) {
        const listRoot = document.querySelector(listSelector);
        if (listRoot) listRoot.innerHTML = overviewAttentionHTML(dept);
        const countEl = countSelector ? document.querySelector(countSelector) : null;
        if (countEl) countEl.textContent = OHT_REQUESTS.inbox((dept || '').toUpperCase()).length;
    }

    return {
        mount: mount,
        setSubtab: setSubtab,
        accept: accept,
        decline: decline,
        partial: partial,
        complete: complete,
        openModal: openModal,
        closeModal: closeModal,
        submitModal: submitModal,
        mountOverviewAttention: mountOverviewAttention
    };
})();
