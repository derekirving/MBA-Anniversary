import "../src/themes/strathweb2022"
import './style.scss';
import { Init, RootUrl } from '@unify/web/dist';
import { HtmxInit } from "@unify/web/dist/htmx";
import { Log, LogLevel } from '@unify/web/dist/logger'
import Search from "../app/search";

async function main() {
    try {
        Init();
        HtmxInit();

        const search = new Search("content-search");
        search.init();

        document.addEventListener('DOMContentLoaded', (evt) => {
            Log(LogLevel.INFO, 'src main:> DOM fully loaded and parsed', evt);
        });

        // If using htmx, this will be more useful than DOMContentLoaded
        document.body.addEventListener('htmx:afterSettle', (evt) => {
            Log(LogLevel.INFO, 'htmx settled', evt);
        });

    } catch (error) {
        throw error;
    }
}

main()
    .then(() => Log(LogLevel.INFO, 'src main:> finished on uri', RootUrl()))
    .catch(error => Log(LogLevel.ERROR, 'src main:> failed to initialize', error));
