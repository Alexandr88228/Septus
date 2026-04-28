'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { getMetrikaId, trackGoal } from '../lib/metrika';

export default function YandexMetrika() {
  const id = getMetrikaId();
  const hit50 = useRef(false);
  const hit90 = useRef(false);

  useEffect(() => {
    if (!id) return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const percent = (scrollTop / maxScroll) * 100;

      if (!hit50.current && percent >= 50) {
        hit50.current = true;
        trackGoal('scroll_50');
      }
      if (!hit90.current && percent >= 90) {
        hit90.current = true;
        trackGoal('scroll_90');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [id]);

  if (!id) return null;

  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${id}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  );
}
