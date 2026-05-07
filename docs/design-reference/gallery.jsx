// Gallery card + grid components for Lyndon Johnson gallery

const { useState, useEffect, useRef } = React;

function ArtCard({ piece, onClick, showLabels = true, layout = "masonry" }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="lj-card"
      onClick={() => onClick(piece)}
      style={{
        cursor: "pointer",
        breakInside: "avoid",
        marginBottom: "var(--lj-gap)",
        opacity: inView ? 1 : 0,
        transition: "opacity 600ms ease, transform 200ms ease, filter 300ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        const img = e.currentTarget.querySelector(".lj-card-img");
        if (img) img.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        const img = e.currentTarget.querySelector(".lj-card-img");
        if (img) img.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <div
        className="lj-card-img"
        style={{
          position: "relative",
          background: "#f0ede8",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          transition: "box-shadow 300ms ease",
        }}
      >
        {inView && (
          <img
            src={piece.image}
            alt={piece.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              opacity: loaded ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
          />
        )}
        {!loaded && (
          <div
            style={{
              paddingBottom: "120%",
              background:
                "linear-gradient(110deg, #f0ede8 25%, #e8e4dd 50%, #f0ede8 75%)",
              backgroundSize: "200% 100%",
              animation: "lj-shimmer 1.6s infinite",
            }}
          />
        )}
      </div>
      {showLabels && (
        <div style={{ paddingTop: 12, paddingLeft: 2 }}>
          <div
            style={{
              fontSize: 14,
              color: "#333",
              letterSpacing: "0.01em",
              fontWeight: 400,
            }}
          >
            {piece.title}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "#999",
              letterSpacing: "0.02em",
              marginTop: 3,
            }}
          >
            {piece.medium}, {piece.year}
          </div>
        </div>
      )}
    </div>
  );
}

function MasonryGrid({ pieces, columns, onPieceClick, showLabels }) {
  return (
    <div
      style={{
        columnCount: columns,
        columnGap: "var(--lj-gap)",
      }}
    >
      {pieces.map((p) => (
        <ArtCard
          key={p.slug}
          piece={p}
          onClick={onPieceClick}
          showLabels={showLabels}
        />
      ))}
    </div>
  );
}

// Uniform grid — every card same aspect ratio, more architectural feel
function UniformGrid({ pieces, columns, onPieceClick, showLabels }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "calc(var(--lj-gap) * 1.4) var(--lj-gap)",
      }}
    >
      {pieces.map((p) => (
        <div key={p.slug} style={{ display: "flex", flexDirection: "column" }}>
          <div
            onClick={() => onPieceClick(p)}
            style={{
              cursor: "pointer",
              aspectRatio: "4 / 5",
              background: "#f0ede8",
              overflow: "hidden",
              position: "relative",
              transition: "transform 200ms ease, box-shadow 300ms ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
            }}
          >
            <img
              src={p.image}
              alt={p.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          {showLabels && (
            <div style={{ paddingTop: 12 }}>
              <div style={{ fontSize: 14, color: "#333", letterSpacing: "0.01em" }}>
                {p.title}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "#999",
                  letterSpacing: "0.02em",
                  marginTop: 3,
                }}
              >
                {p.medium}, {p.year}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Editorial — featured pieces span 2 columns, mixed sizes
function EditorialGrid({ pieces, columns, onPieceClick, showLabels }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: "minmax(0, auto)",
        gap: "calc(var(--lj-gap) * 1.5) var(--lj-gap)",
      }}
    >
      {pieces.map((p, i) => {
        const featured = p.featured || i % 7 === 3;
        const span = featured && columns >= 3 ? 2 : 1;
        const aspect = featured ? "5 / 4" : i % 3 === 0 ? "4 / 5" : "1 / 1";
        return (
          <div
            key={p.slug}
            style={{
              gridColumn: `span ${span}`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              onClick={() => onPieceClick(p)}
              style={{
                cursor: "pointer",
                aspectRatio: aspect,
                background: "#f0ede8",
                overflow: "hidden",
                transition: "transform 200ms ease, box-shadow 300ms ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {showLabels && (
              <div style={{ paddingTop: 12 }}>
                <div style={{ fontSize: 14, color: "#333" }}>{p.title}</div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#999",
                    letterSpacing: "0.02em",
                    marginTop: 3,
                  }}
                >
                  {p.medium}, {p.year}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

window.ArtCard = ArtCard;
window.MasonryGrid = MasonryGrid;
window.UniformGrid = UniformGrid;
window.EditorialGrid = EditorialGrid;
