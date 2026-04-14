export default function Hero({ restaurant, heroPhoto }) {
  const videoUrl = restaurant?.hero_video_url
  const navH = 116

  return (
    <div style={{ paddingTop: navH }}>
      <div style={{
        width: '100%',
        height: `calc(100vh - ${navH}px)`,
        minHeight: 520,
        position: 'relative',
        overflow: 'hidden',
        background: '#1C1A17'
      }}>
        {videoUrl ? (
          <video autoPlay muted loop playsInline style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center' }}>
            <source src={videoUrl} type="video/mp4"/>
          </video>
        ) : heroPhoto?.url ? (
          <img src={heroPhoto.url} alt={restaurant.name}
            style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',animation:'heroZoom 12s ease-in-out infinite alternate' }}/>
        ) : (
          <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,#1a2e0d,#0d1a08)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <p style={{ fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.3)',letterSpacing:3,textTransform:'uppercase' }}>Add a hero photo or video in your dashboard</p>
          </div>
        )}

        {/* Subtle bottom vignette so carousel transition is smooth */}
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:160,background:'linear-gradient(to top,rgba(250,248,243,0.15),transparent)',pointerEvents:'none' }}/>
      </div>
    </div>
  )
}
