import { WsSubscribers } from './WS.js';

let boostFill = {gradient: []}
let orangeGradient = ['#FCC80C', '#FC0C0C'];
let blueGradient = ['#0CF4FC', '#0C58FC'];
let boostAmount = .33;

// Arc layout
$.circleProgress.defaults.arcCoef = 0.5; // range: 0..1
$.circleProgress.defaults.startAngle = 0.5 * Math.PI;

$.circleProgress.defaults.drawArc = function(v) {
    var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        c = this.arcCoef,
        a = this.startAngle + (1 - c) * Math.PI;
    
    v = Math.max(0, Math.min(1, v));

    ctx.save();
    ctx.beginPath();

    if (!this.reverse) {
        ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI * v);
    } else {
        ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI, a + 2 * c * (1 - v) * Math.PI, a);
    }

    ctx.lineWidth = t;
    ctx.lineCap = this.lineCap;
    ctx.strokeStyle = this.arcFill;
    ctx.stroke();
    ctx.restore();
};

$.circleProgress.defaults.drawEmptyArc = function(v) {
    var ctx = this.ctx,
        r = this.radius,
        t = this.getThickness(),
        c = this.arcCoef,
        a = this.startAngle + (1 - c) * Math.PI;

    v = Math.max(0, Math.min(1, v));
    
    if (v < 1) {
        ctx.save();
        ctx.beginPath();

        if (v <= 0) {
            ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI);
        } else {
            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI * v, a + 2 * c * Math.PI);
            } else {
                ctx.arc(r, r, r - t / 2, a, a + 2 * c * (1 - v) * Math.PI);
            }
        }

        ctx.lineWidth = t;
        ctx.strokeStyle = this.emptyFill;
        ctx.stroke();
        ctx.restore();
    }
};

(function circle($) {
  const boostMeter = $('.boost.circle');
  boostMeter.circleProgress({
    animation: { duration: 90 },
    startAngle: .8,
    thickness: 25,
    size: 200,
    value: boostAmount,
    arcCoef: .75,
    lineCap: 'butt',
    fill: boostFill,
    emptyFill: '#2c2c2c'
  }).on('circle-animation-progress', function(event, progress, stepValue) {
    $(this).find('strong').text((stepValue*100).toFixed(0));
  });
  $(() => {
    WsSubscribers.init(49322, true);

    WsSubscribers.subscribe("game", "update_state", (d) => {
      let focusPlayer = d.game.target

      try {
        
        if (d.players[focusPlayer].team == 0) {
        $('.boost.circle').css('display', 'block');
        boostAmount = (d.players[focusPlayer].boost)/100;

        $('.boost.circle').circleProgress('value', (d.players[focusPlayer].boost)/100);
        boostFill.gradient = blueGradient;
        $('.boost.circle').circleProgress('fill', {gradient: blueGradient});
      

        } else if (d.players[focusPlayer].team == 1) {
          $('.boost.circle').css('display', 'block');
          boostAmount = (d.players[focusPlayer].boost)/100;

          $('.boost.circle').circleProgress('value', (d.players[focusPlayer].boost)/100);
          boostFill.gradient = orangeGradient;
          $('.boost.circle').circleProgress('fill', {gradient: orangeGradient});
        } 

      } catch (e) {
        $('.boost.circle').css('display', 'none');
      }
    
  });
    
  });
})(jQuery);
