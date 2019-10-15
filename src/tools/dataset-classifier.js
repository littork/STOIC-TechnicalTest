/*
Determines which track a dataset best maps to.
Assumptions made:
	Each dataset file maps to one specific track type

*/

import * as trackMetadata from "@/circos.tracks.json";

// function identifyAttributeType(value) {
//   console.log(typeof value);
//   switch (typeof value) {
//     case "string":
//       // We must manually identify
//       break;
//     /*
// 		JSON will give us other types, such as "number" sometimes
// 		The current data only ever does this once, with a number. If the json datasets were to be expanded upon, this mechanism would need to be refined.
// 	*/
//     case "number":
//       break;
//   }
//   return 0;
// }

export default function(track) {
  console.log(track.data[0]);
  console.log(trackMetadata);

  // First element of track data will have same structure as every other one, based on the assumption listed at the top of the file
  const trackStructure = Object.entries(track.data[0]).map(trackAttribute => {
    return trackAttribute[0];
    //type: identifyAttributeType(trackAttribute[1])
  });

  console.log(trackStructure);
  trackMetadata.default.forEach(trackType => {
    trackType.params.forEach(trackDataEntry => {
      //console.log(`Comparing ${trackDataEntry.id}`);
      if (trackStructure.includes(trackDataEntry.id)) {
        //console.log(`${trackDataEntry.id} - ${trackType}`);
      }
    });

    // trackType.params.forEach(trackParamEntry => {});
  });

  return 0;
}
