import "../src/themes/strathweb2022"
import './style.scss';
import { confetti } from "@tsparticles/confetti";
import { Init, RootUrl } from '@unify/web/dist';
import { HtmxInit } from "@unify/web/dist/htmx";
import { Log, LogLevel } from '@unify/web/dist/logger'
import Search from "../app/search";

async function main() {
    try {
        Init();
        HtmxInit();

const elem = document.querySelector(".confetti");
        if (elem) {
            const count = 200,
                defaults = {
                    origin: { y: 0.7 },
                };

            function fire(particleRatio, opts) {
                confetti(
                    Object.assign({}, defaults, opts, {
                        particleCount: Math.floor(count * particleRatio),
                    })
                );
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });

            fire(0.2, {
                spread: 60,
            });

            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });

            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }

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
