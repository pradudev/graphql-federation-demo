
const HEADER_NAME = "X-SUBGRAPHS";

fn merge_unique(arr1, arr2) {
    let seen = #{};
    let result = [];

    // Add all items from arr1
    for item in arr1 {
        seen[item] = true;
        result.push(item);
    }

    // Add only new items from arr2
    for item in arr2 {
        if !seen.contains(item) {
            seen[item] = true;
            result.push(item);
        }
    }

    result
}

fn join_array(arr, sep) {
    let result = "";
    for i in 0..arr.len {
        if i > 0 {
            result += sep;
        }
        result += arr[i];
    }
    result
}

// At the supergraph_service stage, register callbacks for processing requests
fn subgraph_service(service, subgraph) {
    let response_callback = |response| {
        if response.headers.contains(HEADER_NAME) {
            let existing = response.context[HEADER_NAME];
            let values = response.headers[HEADER_NAME].split(",");
            if existing == () || existing.len == 0 {
                response.context[HEADER_NAME] = values;
                log_warn("values: " + values);
            } else {
                // Merge and deduplicate
                let merged = merge_unique(existing, values);
                log_warn("merged: " + merged);
                response.context[HEADER_NAME] = merged;
            }
            
            //log_warn("Subgraph response contains header: " + HEADER_NAME + " with value: " + response.headers[HEADER_NAME]);
            //log_warn("DataType: " + type_of(values));
        }
    };
    service.map_response(response_callback);
}

fn supergraph_service(service) {
    // Before sending final response, join all collected header values and set header
    let response_callback = |response| {
        let collected = response.context[HEADER_NAME];
        log_warn("collected: " + collected);
        if collected != () && collected.len() > 0 {
            // Join unique values with comma
            let header_value = join_array(collected, ",");
            response.headers[HEADER_NAME] = header_value;
        }
    };
    service.map_response(response_callback);
}