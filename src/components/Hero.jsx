export default function Hero({ restaurant, heroPhoto }) {
  const videoUrl = restaurant?.hero_video_url
  const navH = 56

  return (
    <div style={{ paddingTop: navH }}>
      {/* Gap between nav and hero */}
      <div style={{ height: 24, background: '#fff' }} />
      <div style={{
        width: '100%',
        height: `calc(100vh - ${navH + 24}px)`,
        minHeight: 500,
        position: 'relative',
        overflow: 'hidden',
        background: '#1C1A17',
        margin: '0 0 0 0'
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
      </div>
    </div>
  )
}
