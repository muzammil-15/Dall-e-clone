import React, { useEffect, useState } from "react";
import { Loader, Card, FormField } from "../components";

const RenderCards = ({data, title})=>{
    if(data?.length>0){
        return data.map((post)=> <Card key={post._id} {...post}/>)
    }
    return(
        <h2 className="mt-5 font-bold text-xl uppercase text-[#6449ff]">{title}</h2>
    )
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(()=>{
    const fetchPosts = async ()=>{
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        })
        
        if(response.ok){
          const result = await response.json();
          setAllPosts(result.data.reverse())
        }

      } catch (error) {
        alert(error)
      }finally{
        setLoading(false);
      }
    }
    fetchPosts();
  },[])

  const handleSearchChange = (e)=>{
    clearTimeout(searchTimeout)
    setSearchText(e.target.value);

    setSearchTimeout(

      setTimeout(()=>{
        const searchResult = allPosts.filter((item)=> item.name.toLowerCase().includes(searchText.toLocaleLowerCase())) || item.prompt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());

        setSearchResults(searchResult);
      }, 500)
    )
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[16px] text-[#666e75] max-w-[500px]">
          The web application in question leverages artificial intelligence to
          produce unique, visual and imaginative images based on user input.{" "}
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search posts"
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading? (
            <div className="flex justify-center items-center">
                <Loader/>
            </div>
        ): (
            <>
                {searchText && (
                    <h2 className="font-medium text-[#666e75] text-xl mb-3">
                        Showing results for <span className="text-[#222328]">{searchText}</span>
                    </h2>
                )}
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                    {searchText ? (
                        <RenderCards data={searchResults} title="No Search Results found"/>
                    ):(
                        <RenderCards data={allPosts} title="no post found"/>
                    )}
                </div>
            </>
        )}
      </div>
    </section>
  );
};

export default Home;
