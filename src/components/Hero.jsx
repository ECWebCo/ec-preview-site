export default function Hero({ restaurant, heroPhoto }) {
  const videoUrl = restaurant?.hero_video_url
  const navH = 116

  return (
    <div style={{ paddingTop: navH }}>
      <div style={{
        width: '100%',
        height: `calc(100vh - ${navH}px)`,
        minHeight: 480,
        position: 'relative',
        overflow: 'hidden',
        background: '#141412'
      }}>

        {videoUrl ? (
          /* ── Video hero ── */
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : heroPhoto?.url ? (
          /* ── Photo hero ── */
          <img
            src={heroPhoto.url}
            alt={restaurant.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              animation: 'heroZoom 10s ease-in-out infinite alternate'
            }}
          />
        ) : (
          /* ── Placeholder ── */
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg,#ede9e0,#d8d3c8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#bbb', letterSpacing: 3, textTransform: 'uppercase' }}>
              Add a hero photo or video in your dashboard
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
