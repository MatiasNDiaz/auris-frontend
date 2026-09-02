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
  // Sin IntersectionObserver no se arma nada: la clase no se agrega y el
  // contenido queda visible, que es el estado por defecto del CSS.
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('js-reveal');

  var pending = function () {
    return d.querySelectorAll('[data-reveal]:not([data-reveal-shown])');
  };
  var show = function (el) { el.setAttribute('data-reveal-shown', ''); };

  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) { show(entries[i].target); io.unobserve(entries[i].target); }
    }
  }, { rootMargin: '0px 0px -80px 0px' });

  // Lo que ya está en pantalla se revela midiendo con getBoundingClientRect, de
  // forma síncrona. La primera entrega del IntersectionObserver es asíncrona, y
  // esperarla es justamente lo que dejaba las secciones en blanco durante ese
  // hueco. Lo de más abajo sí queda a cargo del observer.
  var flushVisible = function () {
    var h = window.innerHeight, nodes = pending();
    for (var i = 0; i < nodes.length; i++) {
      var b = nodes[i].getBoundingClientRect();
      if (b.bottom > 0 && b.top < h) show(nodes[i]);
    }
  };

  var scan = function () {
    flushVisible();
    var nodes = pending();
    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  };

  // Red de seguridad: pase lo que pase, al segundo se revela todo. Nunca puede
  // quedar contenido invisible por un fallo del observer.
  var rescue = function () {
    var nodes = pending();
    for (var i = 0; i < nodes.length; i++) show(nodes[i]);
  };

  var start = function () {
    scan();
    new MutationObserver(scan).observe(d.body, { childList: true, subtree: true });
    setTimeout(rescue, 1000);
  };

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();

  // Vuelta por bfcache (botón atrás del navegador): el DOM se restaura tal cual
  // estaba, pero si quedó algo sin revelar se resuelve acá.
  window.addEventListener('pageshow', function (e) { if (e.persisted) rescue(); });

  // --- Bucles decorativos: se congelan fuera de pantalla ---
  //
  // El navegador no frena solo una animación en bucle porque su elemento salga
  // del viewport. Con los tallos, las hojas al viento y la cinta de reseñas,
  // eso son decenas de animaciones corriendo mientras el usuario mira otra
  // sección. El margen generoso las despierta antes de que asomen, así que
  // nunca se ve una arrancar.
  //
  // Arranca en load y no en DOMContentLoaded: este observer escribe
  // data-offscreen en el DOM, y hacerlo antes de que React hidrate le
  // aparece a React como un atributo que el servidor no mandó. Para entonces
  // ya está todo pintado, y esto es una optimización, no algo que se vea.
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;

  var decor = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      var el = entries[i].target;
      if (entries[i].isIntersecting) el.removeAttribute('data-offscreen');
      else el.setAttribute('data-offscreen', '');
    }
  }, { rootMargin: '250px 0px' });

  // El registro de lo ya observado va en un WeakSet y no en un atributo: menos
  // ruido en el DOM y nada que a React le pueda parecer un desajuste.
  var watchDecor = function () {
    var nodes = d.querySelectorAll('[data-decor]');
    for (var i = 0; i < nodes.length; i++) {
      if (seen && seen.has(nodes[i])) continue;
      if (seen) seen.add(nodes[i]);
      decor.observe(nodes[i]);
    }
  };

  var startDecor = function () {
    watchDecor();
    new MutationObserver(watchDecor).observe(d.body, { childList: true, subtree: true });
  };

  if (d.readyState === 'complete') startDecor();
  else window.addEventListener('load', startDecor);
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
