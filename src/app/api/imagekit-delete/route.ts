import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

  if (!privateKey) {
    return NextResponse.json(
      { error: 'ImageKit private key not configured' },
      { status: 500 }
    );
  }

  try {
    const { fileId, url } = await request.json();

    if (!fileId && !url) {
      return NextResponse.json(
        { error: 'fileId or url is required' },
        { status: 400 }
      );
    }

    let targetFileId = fileId;
    let path = '';

    if (!targetFileId && url) {
      // Extracting path from URL
      const urlObj = new URL(url);
      path = urlObj.pathname;
      
      // If urlEndpoint is provided, remove its pathname prefix from the url's pathname
      if (urlEndpoint) {
        try {
          const endpointObj = new URL(urlEndpoint);
          const endpointPath = endpointObj.pathname;
          if (path.startsWith(endpointPath)) {
            path = path.substring(endpointPath.length);
          }
        } catch (e) {
          // If urlEndpoint is not a full URL (e.g. just the ID), try to remove it if it's at the start
          const id = urlEndpoint.replace('https://ik.imagekit.io/', '').replace('/', '');
          if (path.startsWith('/' + id)) {
            path = path.substring(id.length + 1);
          }
        }
      }

      // Ensure path starts with /
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
      
      // Search for file by path to get fileId
      // We use searchQuery which is more reliable for finding a specific file by path
      const query = `path = "${path}"`;
      const searchResponse = await fetch(
        `https://api.imagekit.io/v1/files?searchQuery=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(privateKey + ':').toString('base64')}`,
          },
        }
      );
      
      let files = await searchResponse.json();

      // Fallback: if searchQuery fails, try to split into folder and name
      if (!Array.isArray(files) || files.length === 0) {
        const lastSlashIndex = path.lastIndexOf('/');
        const folder = path.substring(0, lastSlashIndex) || '/';
        const name = path.substring(lastSlashIndex + 1);

        const fallbackResponse = await fetch(
          `https://api.imagekit.io/v1/files?path=${encodeURIComponent(folder)}&name=${encodeURIComponent(name)}`,
          {
            headers: {
              Authorization: `Basic ${Buffer.from(privateKey + ':').toString('base64')}`,
            },
          }
        );
        files = await fallbackResponse.json();
      }

      if (Array.isArray(files) && files.length > 0) {
        targetFileId = files[0].fileId;
      }
    }

    if (!targetFileId) {
      return NextResponse.json(
        { error: 'Could not find fileId for the given URL', path },
        { status: 404 }
      );
    }

    const deleteResponse = await fetch(
      `https://api.imagekit.io/v1/files/${targetFileId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${Buffer.from(privateKey + ':').toString('base64')}`,
        },
      }
    );

    if (deleteResponse.status === 204 || deleteResponse.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      const errorData = await deleteResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete from ImageKit' },
        { status: deleteResponse.status }
      );
    }
  } catch (error: any) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
