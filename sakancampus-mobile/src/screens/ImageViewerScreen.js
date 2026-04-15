import ImageViewing from 'react-native-image-viewing';

export default function ImageViewerScreen({ navigation, route }) {
  const images = Array.isArray(route?.params?.images) ? route.params.images : [];
  const startIndex = Number(route?.params?.startIndex || 0);
  const imageIndex = Math.max(0, Math.min(startIndex, Math.max(0, images.length - 1)));

  return (
    <ImageViewing
      images={images}
      imageIndex={imageIndex}
      visible
      onRequestClose={() => navigation.goBack()}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
      presentationStyle="overFullScreen"
      backgroundColor="rgba(15,23,42,0.94)"
    />
  );
}
