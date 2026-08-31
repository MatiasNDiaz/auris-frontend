/**
 * Motor del scroll-reveal, como script inline en el `<head>`.
 *
 * Va inline y no como componente de React a propósito. El bug que arregla es
 * justamente que el revelado dependiera de la hidratación: acá corre durante el
 * parseo del documento, antes del primer pintado y sin esperar a que baje el
 * bundle, así que las secciones nunca se quedan en blanco.
 *
 * Hace tres cosas, en orden:
 *   1. marca `<html>` con `js-reveal`, que es lo único que activa el estado
 *      oculto en CSS — sin JS el contenido queda visible y no se oculta nunca;
 *   2. observa cada `[data-reveal]` con un IntersectionObserver y les pone
 *      `data-reveal-shown` al entrar (mismo umbral que tenía Framer: -80px);
 *   3. sigue observando los que aparecen después, vía MutationObserver, para
 *      cubrir el contenido que monta React al hidratar.
 */
const SCRIPT = `
(function () {
  var d = document, root = d.documentElement;
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('js-reveal');

  var show = function (el) { el.setAttribute('data-reveal-shown', ''); };

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) { show(entries[i].target); io.unobserve(entries[i].target); }
    }
  }, { rootMargin: '0px 0px -80px 0px' });

  var scan = function () {
    var nodes = d.querySelectorAll('[data-reveal]:not([data-reveal-shown])');
    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  };

  // Red de seguridad: si algo impide que el observer dispare, a los 3 segundos
  // se revela todo. Nunca puede quedar contenido invisible.
  var rescue = function () {
    var nodes = d.querySelectorAll('[data-reveal]:not([data-reveal-shown])');
    for (var i = 0; i < nodes.length; i++) show(nodes[i]);
  };

  var start = function () {
    scan();
    new MutationObserver(scan).observe(d.body, { childList: true, subtree: true });
    setTimeout(rescue, 3000);
  };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();
})();
`;

export function RevealScript() {
  return (
    <script
      // El contenido es una constante del propio bundle, no entra nada del
      // usuario: no hay superficie de inyección.
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
