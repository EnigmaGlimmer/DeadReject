import { MissedVideoCallOutlined } from "@material-ui/icons";
import { createClient } from "graphqurl";

const client = createClient({
  endpoint: `${process.env.REACT_APP_GRAPHQL_API_URI}`,
  headers: {
    "x-hasura-admin-secret": `${process.env.REACT_APP_HASURA_SECRET}`,
  },
});

export const getDataByMint = async (mint: any) => {
  try {
    const data = await client
    .query({
      query: `
      query getData(
        $where: mint_bool_exp
      ) {
        mint(where: $where) {
            mint
            owner
            status
        }
      }`,
      variables: {
        where: {
          mint: {
            _eq: mint,
          },
        },
      },
    })
    return {ok: true, data: data.data.mint}
  } catch(err) {
    console.log(err);
    return {ok: false, data: null}
  }
}

export const getDataByStatus = async (status: any) => {
  try {
    const data = await client
    .query({
      query: `
      query getOwner(
        $where: mint_bool_exp
      ) {
        mint(where: $where) {
            mint
            owner
            status
        }
      }`,
      variables: {
        where: {
          status: {
            _eq: status,
          },
        },
      },
    })
    return {ok: true, data: data.data.mint}
  } catch(err) {
    console.log(err);
    return {ok: false, data: null}
  }
}

export const getDataByOwner = async (owner: any) => {
  try {
    const data = await client
    .query({
      query: `
      query getOwner(
        $where: mint_bool_exp
      ) {
        mint(where: $where) {
            mint
            owner
            status
        }
      }`,
      variables: {
        where: {
          owner: {
            _eq: owner,
          },
        },
      },
    })
    return {ok: true, data: data.data.mint}
  } catch(err) {
    console.log(err);
    return {ok: false, data: null}
  }
}

export const getOrInsertData = async (owner: any) => {
  const data = await getDataByMint(owner);
  if(!data.ok || data.data.length == 0) {
    await insertData(owner, owner, 0);
    return 0;
  }
  return data.data[0]?.status;
}

export const insertData = async (mint: any, owner: any, status: any) => {
  try {
    const data = await client
    .query({
      query: `
      mutation insertData(
        $objects: [mint_insert_input!]!
      ) {
        insert_mint(objects: $objects) {
          returning {
            mint
            owner
            status
          }
        }
      }
    `,
      variables: {
        objects: [
          {
            mint,
            owner,
            status
          },
        ],
      },
    })
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export const updateData = async (mint: any, owner: any, status: any) => {
  try {
    const data = await client
    .query({
      query: `
      mutation updateData(
        $where: mint_bool_exp!
        $_set: mint_set_input
      ) {
        update_mint(where: $where, _set: $_set) {
          returning {
            status
          }
        }
      }
    `,
      variables: {
        where: {
          mint: {
            _eq: mint
          },
        },
        _set: {
          status: status
        }
      },
    })
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

