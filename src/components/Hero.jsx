export default function Hero({ restaurant, heroPhoto }) {
  return (
    <div style={{ paddingTop:116 }}>
      <div style={{ width:'100%',height:'calc(100vh - 116px)',minHeight:480,position:'relative',overflow:'hidden',background:'#e0dbd0' }}>
        {heroPhoto?.url
          ? <img src={heroPhoto.url} alt={restaurant.name} style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',animation:'heroZoom 10s ease-in-out infinite alternate' }}/>
          : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,#ede9e0,#d8d3c8)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <p style={{ fontFamily:'DM Sans',fontSize:13,color:'#bbb',letterSpacing:3,textTransform:'uppercase' }}>Add a hero photo in your dashboard</p>
            </div>
        }
      </div>
    </div>
  )
}
