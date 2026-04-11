export default function Hero({ restaurant, heroPhoto }) {
  return (
    <div style={{ paddingTop: 112 }}>
      <div style={{ width:'100%', height:'calc(100vh - 112px)', minHeight:440, position:'relative', overflow:'hidden', background:'#E8E4DE' }}>
        {heroPhoto?.url
          ? <img src={heroPhoto.url} alt={restaurant.name} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', animation:'heroZoom 10s ease-in-out infinite alternate' }} />
          : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#f0ece4,#ddd8ce)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:'DM Sans', fontSize:13, color:'#bbb', letterSpacing:3, textTransform:'uppercase' }}>Add a hero photo in your dashboard</p>
            </div>
        }
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
    </div>
  )
}
