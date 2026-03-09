(function () {
    const SCRIPT_URL = document.currentScript.src;
    const URL_OBJ = new URL(SCRIPT_URL);
    const WORKSPACE_ID = URL_OBJ.searchParams.get('id');

    if (!WORKSPACE_ID) {
        console.error('SupportIQ: Missing workspace ID in script tag. Please use ?id=YOUR_ID');
        return;
    }

    const container = document.createElement('div');
    container.id = 'supportiq-widget-root';
    document.body.appendChild(container);

    const iframe = document.createElement('iframe');
    iframe.src = `${URL_OBJ.origin}/widget?id=${WORKSPACE_ID}`;
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100px';
    iframe.style.height = '100px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.id = 'supportiq-widget-iframe';

    container.appendChild(iframe);

    window.addEventListener('message', (event) => {
        if (event.data.type === 'supportiq-resize') {
            iframe.style.width = event.data.width;
            iframe.style.height = event.data.height;
        }
    });
})();
