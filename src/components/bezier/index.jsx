import { Component } from 'react';  
import styles from './getStyles';
import { getBezierY} from './utils';
class Bezier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x:0.1,
            y:'please check x value -> [0,1]',
            t:0
        };
    }
    init=()=>{
        var canvas = this.canvas;
        var code = this.code;
        var clickPoint = null; 
        var sourcePoint; 
        var ctx = canvas.getContext("2d");
        var point = this.props.pointO.point;
        var round = {
          curve: { width: 2, color: "#1572b5" },
          cpline: { width: 0.5, color: "#cf4520" },
          point: {
            radius: 10,
            width: 1,
            color: "#009696",
            fill: "rgba(0,170,187,0.6)",
            cursor: "pointer"
          }
        };
        point = { p1: { x: point.p1.x, y: point.p1.y }, p2: { x: point.p2.x, y: point.p2.y }, cp1: { x: point.cp1.x, y: point.cp1.y },cp2: { x: point.cp2.x, y: point.cp2.y } };
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        canvas.onmousedown = mouseDownFun;
        canvas.onmousemove = mouseMoveFun;
        canvas.onmouseup = canvas.onmouseout = mouseUpFun;
        var that = this;
        drawCanvas()
        function mouseDownFun(e) {
            e = getPoint(e);
            var dx, dy;
            for (var v in point) {
              dx = point[v].x - e.x;
              dy = point[v].y - e.y;
              //判断点击区域是否在可见圆内
              if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(round.point.radius, 2)) {
                clickPoint = v;
                sourcePoint = e;
                canvas.style.cursor = "move";
                return
              }
            }
          }
         function appendText() {
            var codeHTML = "";
            const { width , height} = that.canvas;
            const cp1x = number2Fixed(point.cp1.x / width);
            const cp1y = number2Fixed((height - point.cp1.y) / height);
            const cp2x = number2Fixed(point.cp2.x / width);
            const cp2y = number2Fixed((height - point.cp2.y) / height);
            if (point.cp2) {
              codeHTML = "cubic-bezier(" + cp1x + ", " + cp1y + ", " + cp2x + ", " + cp2y + ")\n"
            }
            // const moveTo ='ctx.moveTo('+point.p1.x+", "+point.p1.y+");\n";
            const p1 = [0, 0];
            const p2 = [1, 1];
            const cp1 = [cp1x, cp1y];
            const cp2 = [cp2x, cp2y];
            that.cp1 = cp1;
            that.cp2 = cp2;
            that.setState({cp1,cp2});
            // const aim_ponit = threeBezier(t, p1, cp1, cp2, p2);
            // const fun_t = number2Fixed(getBezierT(p1, cp1, cp2, p2, aim_ponit));
            // const bezierY = getBezierY(0.9, 0, 1, p1, cp1, cp2, p2);
            // for (let index = 0; index < 10; index++) {
            //     const bezierY = getBezierY(index/10, 0, 1, p1, cp1, cp2, p2);
            //     console.log(bezierY['point'],'t:',bezierY['t'],'x:',index/10,cp1,cp2)
            // }
            // console.log('getBezierY:',bezierY['point'],bezierY,'aim_ponit:',aim_ponit)
            code.innerHTML = codeHTML ;
          }
          function drawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.lineWidth = round.cpline.width;
            ctx.strokeStyle = round.cpline.color;
            ctx.beginPath();
            ctx.moveTo(point.p1.x, point.p1.y);
            ctx.lineTo(point.cp1.x, point.cp1.y);
            ctx.moveTo(point.p2.x, point.p2.y);
            ctx.lineTo(point.cp2.x, point.cp2.y)
            ctx.stroke();
            ctx.lineWidth = round.curve.width;
            ctx.strokeStyle = round.curve.color;
            ctx.beginPath();
            ctx.moveTo(point.p1.x, point.p1.y);
            ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);
            ctx.stroke();
            for (var v in point) {
              ctx.lineWidth = round.point.width;
              ctx.strokeStyle = round.point.color;
              ctx.fillStyle = round.point.fill;
              ctx.beginPath();
              ctx.arc(point[v].x, point[v].y, round.point.radius, 0, 2 * Math.PI, true);
              ctx.fill();
              ctx.stroke()
            }
            appendText()
          }
          function mouseMoveFun(e) {
            if (clickPoint) {
              e = getPoint(e);
              point[clickPoint].x += e.x - sourcePoint.x;
              point[clickPoint].y += e.y - sourcePoint.y;
              sourcePoint = e;
              const { x } = that.state;
              if(x!==0&&x<=1){
                that.shake(that.getBezierXY(),200)
              }
              drawCanvas()
            } else {
              e = getPoint(e);
              var dx, dy;
              for (var v in point) {
                dx = point[v].x - e.x;
                dy = point[v].y - e.y;
                if (Math.pow(dx, 2) + Math.pow(dy, 2) < Math.pow(round.point.radius, 2)) {
                  canvas.style.cursor = "pointer";
                  return
                } else {
                  canvas.style.cursor = "default";
                }
              }
            }
          }
          function mouseUpFun(e) {
            clickPoint = null;
            canvas.style.cursor = "default";
            drawCanvas()
          }
          function getPoint(e) {
            e = (e ? e : window.event);
            return { x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop }
          }
          function number2Fixed(number) {
            return parseFloat(number).toFixed(2)
          }
    }
    componentDidMount(){
        this.init()
    }
    shake(fn, wait) {
        let timer = null;
        return function () {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments)
            }, wait);
        }
    }
    getBezierXY(){
        const x = parseFloat(this.inputX.value);
        this.setState({x})
        const { cp1 , cp2 } = this;
        const p1 = [0, 0];
        const p2 = [1, 1];
        if((x>=0&&x<=1)){
            const bezierInfo = getBezierY(x, 0, 1,p1, cp1, cp2,p2);
            const { point ,t } = bezierInfo;
            this.setState({y:point[1],t})
        }else{
            this.setState({y:'please check x value -> [0,1]'})
        }
    }
    render() {
        const { y ,t} = this.state;
        const { pointO } = this.props;
        return (
        <div>
            <canvas id="canvas" ref={r => (this.canvas = r)} style={styles.canvas} width="600" height="600">你的浏览器不支持canvas</canvas>
            <pre id="code" style={styles.code} ref={r => (this.code = r)} >code</pre>
            <div style={styles.box}>
                <div>x:<input type="text" ref={r => (this.inputX = r)} onChange={this.shake(this.getBezierXY.bind(this),500)}/></div>
                <div>y:<em>{y}</em></div>
                <div>t:<em>{t}</em></div>
            </div>
        </div>  
        );
      }
}


export default Bezier;
