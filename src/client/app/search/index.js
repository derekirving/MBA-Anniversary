import './style.scss'
import './highlight'

class Search {
    constructor(element) {
        this.element = element;
    }
    init() {

        window.addEventListener('DOMContentLoaded', (event) => {

            const elem = this.element;

            if(document.getElementById(elem) === null)
            {
                console.warn(`[unify]: Search element "${elem}" not found. Aborting.`);
                return;
            }

            if (typeof (PagefindUI) === 'undefined') {
                document.getElementById(elem).innerHTML = '<span class="text-danger"><i class="fa fa-exclamation mr-1  mt-1" aria-hidden="true"></i> execute "<i>npm run dist:index</i>"&nbsp;to populate search</span>';
                return;
            }

            new PagefindUI({
                element: "#" + elem,
                highlightParam: "highlight",
                excerptLength: 60,
                showEmptyFilters: true,
                showImages: false,
                showSubResults: false,
                resetStyles: true,
                //debounceTimeoutMs: 500,
                translations: {
                    placeholder: "Search in the MBA Anniversary site..",
                    zero_results: "Couldn't find [SEARCH_TERM]"
                },
                processResult: function (result) {

                    result.url = result.url.replace('/assets', '');

                    const url = new URL(result.url, 'http://example.com');

                    if(result.pathname !== '/')
                    {
                        result.url = url.pathname + '/' + url.search;
                    }

                    result.sub_results.forEach((item) => {

                        item.url = item.url.replace('/assets', '');

                        const subUrl = new URL(item.url, 'http://example.com');

                        if(!subUrl.pathname.endsWith('/'))
                        {
                            item.url = subUrl.pathname + '/' + subUrl.search;
                        }
                    });

                    return result;
                }
            });

            this.#waitForElm('.pagefind-ui__search-input').then((elm) => {
                
                document.getElementById(elem).classList.remove("d-none");

                elm.addEventListener('focus', function () {
                    if (window.matchMedia('(min-width: 576px)').matches) {
                        document.getElementById(elem).classList.add("search-focus");
                        elm.style.width = "-webkit-fill-available !important";
                    }
                })

                elm.addEventListener('blur', function () {
                    setTimeout(function () {
                        if (window.matchMedia('(min-width: 576px)').matches) {
                            document.getElementById(elem).classList.remove("search-focus");
                        }
                    }, 500);
                    return true;
                }, false);
            });

            const contentId = document.getElementById(elem).dataset.contentId;

            new PagefindHighlight({ highlightParam: "highlight", markContext: `#${contentId}` });

            const params = new URLSearchParams(window.location.search);
            const highlight = params.get('highlight');

            if (highlight !== null) {
                const searchElem = document.querySelector('.pagefind-ui__search-input');

                searchElem.value = highlight;
                searchElem.focus();

                const clearElem = document.querySelector('.pagefind-ui__search-clear');
                clearElem.classList.remove('pagefind-ui__suppressed');

                clearElem.addEventListener('click', function (e) {
                    searchElem.value = "";
                    e.target.classList.add('pagefind-ui__suppressed');
                    history.replaceState("", document.title, window.location.pathname);
                    document.querySelectorAll('mark').forEach((elem) => {
                        elem.classList.remove('pagefind-highlight');
                        elem.style.backgroundColor = 'initial';
                    });
                });
            }
        });
    }

    #waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
}

export default Search