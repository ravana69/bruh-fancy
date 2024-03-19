// inspired by https://codepen.io/loficodes/pen/XWGvaYr
c = document.querySelector('#c')
c.width = 1920
c.height = 1080
x = c.getContext('2d')
C = Math.cos
S = Math.sin
t = 0

rsz=window.onresize=()=>{
  setTimeout(()=>{
    if(document.body.clientWidth > document.body.clientHeight*1.77777778){
      c.style.height = '100vh'
      setTimeout(()=>c.style.width = c.clientHeight*1.77777778+'px',0)
    }else{
      c.style.width = '100vw'
      setTimeout(()=>c.style.height =     c.clientWidth/1.77777778 + 'px',0)
    }
  },0)
}
rsz()

async function Draw(){
  oX=oY=oZ=0
  if(!t){
    R=R2=(Rl,Pt,Yw,m)=>{
      M=Math
      A=M.atan2
      H=M.hypot
      X=S(p=A(X,Z)+Yw)*(d=H(X,Z))
      Z=C(p)*d
      Y=S(p=A(Y,Z)+Pt)*(d=H(Y,Z))
      Z=C(p)*d
      X=S(p=A(X,Y)+Rl)*(d=H(X,Y))
      Y=C(p)*d
      if(m){
        X+=oX
        Y+=oY
        Z+=oZ
      }
    }
    Q=()=>[c.width/2+X/Z*700,c.height/2+Y/Z*700]
    Rn = Math.random

    cl = 44
    rw = 14
    br = 1
    sp = 1
    iGridc = 3
    loadGrid = () => {
      l_ = typeof grids == 'undefined'
      grids = l_ ? [] : grids
      let cull = false
      grids.map((grid_, gridIdx) => {
        let ofy = sp * (rw-1.5) * (gridIdx - iGridc/2 + .5) + grid_[1]
        if(ofy < -sp * (rw-1.5)*2) cull = true
      })
      if(cull){
        grids.shift()
        grids.map(v=>{
          v[1]=0
        })
      }
      if(!l_ && grids.length>=iGridc) return
      let id
      let ct_ = 0
      let grid = [], ct=(Rn()*rw/2)|0
      for(let n = 0; n<br; n++){
        for(let k = 0; k<cl; k++){
          id = grids.length ? grids[0][0][ct_][6] : Rn()*cl|0
          for(let j = 0; j<rw; j++){
            X1 = ((k%cl)-cl/2+.5)*sp
            Y1 = ((j%rw)-rw/2+.5)*sp
            Z1 = ((n%br)-br/2+.5)*sp
            ofx = 0
            X2 = (((k+ofx)%cl)-cl/2+.5)*sp
            Y2 = (((j+1)%rw)-rw/2+.5)*sp
            Z2 = ((n%br)-br/2+.5)*sp
            state = j > 2 && j < rw - 3 && k < cl-2 && !(ct%6) ? Rn()*4|0 : false
            grid = [...grid, [X1, Y1, Z1, X2, Y2, Z2, id, state]]
            if(Rn()<1) ct++
            ct_++
          }
        }
      }
      grids = [...grids, [grid, 0]]
    }
    
    stroke = (scol, fcol, lwo=1, od=true, oga=1) => {
      if(scol){
        //x.closePath()
        if(od) x.globalAlpha = 1*oga
        x.lineWidth = Math.min(1000,100*lwo/Z)
        x.strokeStyle = '#000'
        if(od) x.stroke()
        x.strokeStyle = scol
        x.lineWidth /= 2.5
        x.globalAlpha = 1*oga
        x.stroke()
      }
      if(fcol){
        x.globalAlpha = 1*oga
        x.fillStyle = fcol
        x.fill()
      }
    }
    bezTo = (X1,Y1,Z1,X2,Y2,Z2,col1,col2,lw=1,dual=true,horizontal=true) =>  {
      if(horizontal){
        Xa = X1 + (X2-X1)/3*2
        Ya = Y1
        Za = Z1 + (Z2-Z1)/3*2
        Xb = X1 + (X2-X1)/3*1
        Yb = Y2
        Zb = Z1 + (Z2-Z1)/3*2
      }else{
        Xa = X1
        Ya = Y1 + (Y2-Y1)/3*2
        Za = Z1 + (Z2-Z1)/3*2
        Xb = X2
        Yb = Y1 + (Y2-Y1)/3*1
        Zb = Z1 + (Z2-Z1)/3*2
      }
      x.beginPath()
      X = X1
      Y = Y1
      Z = Z1
      R(Rl,Pt,Yw,1)
      if(Z>0) x.moveTo(...Q())
      X = Xa
      Y = Ya
      Z = Za
      R(Rl,Pt,Yw,1)
      if(Z>0) l1 = Q()
      X = Xb
      Y = Yb
      Z = Zb
      R(Rl,Pt,Yw,1)
      if(Z>0) l2 = Q()
      X = X2
      Y = Y2
      Z = Z2
      R(Rl,Pt,Yw,1)
      if(Z>0) x.bezierCurveTo(...l1, ...l2, ...Q())
      stroke(col1, col2, lw, dual)
    }
  }

  oX=0, oY=0, oZ=16
  Rl=0, Pt=0, Yw=0

  x.globalAlpha = 1
  x.fillStyle='#0008'
  x.fillRect(0,0,c.width,c.height)
  x.lineJoin = x.lineCap = 'roud'

  loadGrid()
  lw_=5+S(t)*3
  grids.map((grid_, gridIdx) => {
    let ofy = sp * (rw-1.5) * ((gridIdx+.5) - iGridc/2 + .5) + (grid_[1]-=Math.max(0, Math.min(.125,(.3+S(t/2))*.2)))
    grid = grid_[0]
    grid.map((v, i) => {
      if(!((i%rw)|0)) {
        x.beginPath()
        X = v[0]
        Y = v[1]-.1 + ofy
        Z = v[2]
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
      }
      if((i%rw)==rw-2) {
        X = v[3]
        Y = v[4]+.1 + ofy
        Z = v[5]
        R(Rl,Pt,Yw,1)
        if(Z>0) x.lineTo(...Q())
        col1 = `hsla(${360/cl*v[6]+t*50},99%,50%,1)`
        col2 = ''
        stroke(col1, col2, lw_, true)
      }
    })

    let direction
    for(let i=grid.length;i--;){
      v=grid[i]
      if(v[7] !== false){
        switch(v[7]){
          case 0:
            direction = 0
            idx2 = i+rw*2-2
            X2 = grid[idx2][0]
            Y2 = grid[idx2][1] + ofy
            Z2 = grid[idx2][2]
            break
          case 1:
            direction = 1
            idx2 = i+rw*2+1
            X2 = grid[idx2][3]
            Y2 = grid[idx2][4] + ofy
            Z2 = grid[idx2][5]
            break
          case 2:
            direction = 0
            idx2 = i+rw-2
            X2 = grid[idx2][0]
            Y2 = grid[idx2][1] + ofy
            Z2 = grid[idx2][2]
            break
          case 3:
            direction = 1
            idx2 = i+rw+1
            X2 = grid[idx2][3]
            Y2 = grid[idx2][4] + ofy
            Z2 = grid[idx2][5]
            break
        }
        if(grid[i+1][7] === false && grid[i-1][7] === false && grid[idx2][7] === false && grid[idx2+1][7]===false && grid[idx2-1][7] === false){
          X = X1 = v[0]
          Y = Y1 = v[1]-.1 + ofy
          Z = Z1 = v[2]
          R(Rl,Pt,Yw,1)
          if(Z>0) l1 = Q()
          X = X2
          Y = Y2+.1
          Z = Z2
          R(Rl,Pt,Yw,1)
          if(Z>0) l2 = Q()
          cl1 = `hsla(${360/cl*v[6]+t*50},99%,50%,1)`
          cl2 = `hsla(${360/cl*grid[idx2][6]+t*50},99%,50%,1)`
          grd = x.createLinearGradient(...l1, ...l2)
          grd.addColorStop(0, cl1)
          grd.addColorStop(1, cl2)
          col1 = grd
          col2 = ''
          bezTo(X1,Y1,Z1,X2,Y2,Z2,col1,col2,lw_,dual=true,horizontal=false)
        }
      }
    }
  })

  t+=1/60
  requestAnimationFrame(Draw)
}
Draw()