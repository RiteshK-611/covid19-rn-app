import React from 'react';

type WorldDataContextType = {
    data: IWorldData[] | null;
    refresh: () => Promise<void>;
}
const WorldDataContext = React.createContext<WorldDataContextType>({data: [], refresh: async () => {}});

export default WorldDataContext;