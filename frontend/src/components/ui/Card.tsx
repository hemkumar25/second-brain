import { AddIcon,DeleteIcon, DocIcon } from "../../icons/AddIcon";
import { ShareIcon } from "../../icons/ShareIcon";


interface CardProps {
    title:string;
    link:string;
    type: "twitter" | "youtube"
}

export const Card = ({title, link, type} : CardProps) => {
    const getEmbedUrl = (url:string) => {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      };

  return (
  <>
    <div className="card border-2 max-w-80 min-w-80 p-2 min-h-96 rounded-md overflow-hidden ">
         {/* card header */}
        <div className="flex justify-between items-center ">
            <div className="flex items-center p-2 border-2 gap-2">
                <div className="">
                    <DocIcon/>
                </div>
                {title}
            </div>
            <div className="flex gap-4 p-2">
                <div className="">
                    <a href={link} target="_blacnk"></a>
                    <ShareIcon/>
                </div>
                <div className="">
                    <DeleteIcon/>
                </div>
            </div>
        </div>

        {/*card body*/}
        <div className=" max-h-56 rounded-md pt-4 overflow-hidden">
          <div>
            {type ==="youtube" && <iframe
            width="100%"
            height="315"
            src={getEmbedUrl(link)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>}

            {type=="twitter" && <blockquote className="twitter-tweet ">
                    <a href={link.replace("x.com", "twitter.com")}></a>
                </blockquote>}
          </div>
        </div>

        {/*tags*/}
        <div>

        </div>
    </div>
  </>
  );
};
