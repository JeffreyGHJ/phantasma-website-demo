import { collectionItemImageUrl } from "../../../../utils/collectionitemUtils";
import { useView3d } from "../../../../state/application/hooks";

const NftImage = ({
  item,
  height = "200px",
  width = "200px",
}: {
  item:
    | {
        image_3d?: string;
        image_png?: string;
        image_gif?: string;
        token_image_ext: string;
        name: string;
        token_id: string | number;
      }
    | null
    | undefined;
  height?: string;
  width?: string;
}) => {
  const view3d = useView3d();

  return item ? (
    <img
      className="widget NftImage"
      src={collectionItemImageUrl({
        view3d,
        item,
      })}
      alt={`${item.name} #${item.token_id}`}
      height={height}
      width={width}
      style={{
        objectFit: "cover",
        borderRadius: "5px",
      }}
      onError={(e) => {
        const target = e.currentTarget;
        // If the primary URL (image_gif / image_3d) fails, try image_png as a
        // fallback.  Guard against an infinite loop: if image_png is already
        // loaded (or also fails) we clear onError so the browser stops retrying.
        const fallback = item.image_png;
        if (fallback && target.src !== fallback) {
          target.src = fallback;
        } else {
          target.onerror = null;
        }
      }}
    />
  ) : (
    <></>
  );
};

export default NftImage;
