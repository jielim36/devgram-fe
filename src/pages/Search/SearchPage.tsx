import Icon from "@/components/Icon/Icon";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import SearchPostListing from "./SearchPostListing";
import SearchUserListing from "./SearchUserListing";

const SearchPage = () => {

    const [searchValue, setSearchValue] = useState("");
    const [passingValue, setPassingValue] = useState("");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPassingValue(searchValue);
    }

    return (
        <>
            <div className="relative px-2 xs:px-0 xs:w-[340px] sm:w-[530px] left-2/4 -translate-x-2/4 xl:-translate-x-3/4">
                <div className="relative w-full">
                    <form onSubmit={handleSearch}>
                        <Input
                            placeholder="Search"
                            className="pl-10 rounded-full"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button type="submit" className="absolute left-4 top-3">
                            <Icon name="search" className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </form>
                </div>

                <Tabs defaultValue="post">
                    <TabsList className="w-full grid grid-cols-2 mt-6 mb-6">
                        <TabsTrigger value="post">Post</TabsTrigger>
                        <TabsTrigger value="user">User</TabsTrigger>
                    </TabsList>
                    <TabsContent value="post">
                        <SearchPostListing searchValue={passingValue} />
                    </TabsContent>
                    <TabsContent value="user">
                        <SearchUserListing searchValue={passingValue} />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}

export default SearchPage;